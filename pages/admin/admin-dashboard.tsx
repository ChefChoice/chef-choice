import { CheckCircleIcon, ChevronLeftIcon, XCircleIcon } from '@heroicons/react/outline';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { User } from '@supabase/supabase-js';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Heading from '../../components/common/Heading';
import { Certificate } from '../../models/Certificate';
import { supabase } from '../../utils/supabaseClient';
// @ts-ignore
import ModalImage from 'react-modal-image';
import Loading from '../../components/common/Loading';
import Modal from '../../components/modals/Modal';
import { useRouter } from 'next/router';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

const AdminDashboard: NextPage = () => {
  const { reload } = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [certToUrlMap, setCertToUrlMap] = useState<Map<Certificate, string | null | undefined>>(
    new Map()
  );

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [certId, setCertId] = useState('');
  const [homechefId, setHomechefId] = useState('');
  const [certType, setCertType] = useState('');

  const closeModal = () => {
    showApproveModal ? setShowApproveModal(false) : setShowRejectModal(false);
  };

  useEffect(() => {
    getData();
  }, [user, showApproveModal, showRejectModal]);

  async function getData() {
    try {
      setUser(supabase.auth.user());

      console.log(user);

      if (user) {
        let { data, error, status } = await supabase
          .from<Certificate>('Certificate')
          .select(`*`)
          .match({ status: 'Pending' });

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          const retrievedCertToUrlMap = new Map<Certificate, string | null | undefined>();
          for (const cert of data) {
            const certUrl: string | null | undefined = await downloadCertificate(
              cert.homechef_id,
              cert.image
            );
            retrievedCertToUrlMap.set(cert, certUrl);
          }
          setCertToUrlMap(retrievedCertToUrlMap);
          setLoading(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function downloadCertificate(homechef_id: string, image: string) {
    try {
      if (homechef_id) {
        const authorizedImgPath = `${homechef_id}/${image}?t=${Date.now()}`;

        const { data, error } = await supabase.storage
          .from('cert-images')
          .download(authorizedImgPath);

        if (error) {
          throw error;
        }

        if (data) {
          const url = URL.createObjectURL(data);
          return url;
        }
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async function updateCertStatus(status: string) {
    if (status !== '') {
      const { error: certErr } = await supabase
        .from('Certificate')
        .update({ status: status })
        .match({ id: certId });

      // Verify chef
      if (certType === 'Required' && status === 'Approved') {
        verifyChef();
      }

      if (certErr) {
        console.log(certErr);
      }
      showApproveModal ? setShowApproveModal(false) : setShowRejectModal(false);
    }
  }

  async function verifyChef() {
    const { error: chefErr } = await supabase
      .from('HomeChef')
      .update({ verified: true })
      .match({ id: homechefId });

    if (chefErr) {
      console.log(chefErr);
    }
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <main className="flex h-full w-full flex-col py-20 px-10">
        <div className="pt-3">
          <Heading
            title={'List of certificates waiting for review'}
            optionalNode={
              <button
                className="rounded border-2 border-solid border-black bg-white py-1 px-8 text-lg font-medium hover:ring hover:ring-green-light"
                onClick={() => {
                  reload();
                }}
              >
                Refresh
              </button>
            }
            optionalNodeRightAligned={true}
          />

          <div className="w-full">
            {loading ? (
              <Loading />
            ) : certToUrlMap.size === 0 ? (
              'No records found'
            ) : (
              Array.from(certToUrlMap.keys()).map((cert) => {
                return (
                  <div
                    className="grid grid-cols-5 grid-rows-2 place-items-center gap-2 py-2 px-1 text-lg sm:grid-cols-9 sm:grid-rows-1"
                    key={cert.id}
                  >
                    <div className="w-10 sm:w-20" title="View Certificate">
                      <ModalImage
                        small={certToUrlMap.get(cert)}
                        large={certToUrlMap.get(cert)}
                        hideZoom={true}
                        alt={cert.name}
                      />
                    </div>
                    <div className="col-span-2 justify-self-start" title="Certificate name">
                      <p className="break-all">{cert.name}</p>
                    </div>
                    <div className="col-span-2 break-words" title="Awarded By">
                      {cert.awardedBy}
                    </div>
                    <div className="col-span-1 break-words" title="Issued Date">
                      {cert.date.toString()}
                    </div>
                    <div className="col-span-1 break-words" title="Expiry Date">
                      {cert.expirydate.toString()}
                    </div>

                    <div className="col-span-1" title="Certificate Type">
                      <p className="break-all">{cert.type}</p>
                    </div>

                    <div className="ml-auto grid-rows-2 sm:grid-rows-1">
                      <button
                        className="mr-5"
                        onClick={() => {
                          setShowApproveModal(true);
                          setCertId(cert.id);
                          setCertType(cert.type);
                          setHomechefId(cert.homechef_id);
                        }}
                      >
                        <a title="Approve Certificate">
                          <CheckCircleIcon className="h-8 w-8" />
                        </a>
                      </button>

                      <button
                        onClick={() => {
                          setShowRejectModal(true);
                          setCertId(cert.id);
                        }}
                      >
                        <a title="Reject Certificate">
                          <XCircleIcon className="h-8 w-8" />
                        </a>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* Approval && Reject Modal */}
        <Modal
          visible={showApproveModal}
          title={'Confirm Approval'}
          content={
            <p className="mx-2 mb-4 break-words text-lg">
              Are you sure you want to approve this certificate?
            </p>
          }
          leftBtnText={'Yes'}
          leftBtnOnClick={() => {
            return updateCertStatus('Approved');
          }}
          rightBtnText={'No'}
          rightBtnOnClick={closeModal}
          hideLeftBtn={false}
        />
        <Modal
          visible={showRejectModal}
          title={'Confirm Rejection'}
          content={
            <>
              <p className="mb-2">
                State your reason <i>(max 20 characters)</i>
              </p>
              <input
                className="m-3 border-2 p-3"
                type="text"
                id="r-msg"
                maxLength={20}
                placeholder="..."
              />
            </>
          }
          leftBtnText={'Yes'}
          leftBtnOnClick={() => {
            const msg = (document.getElementById('r-msg') as HTMLInputElement)?.value;
            return updateCertStatus('Rejected: ' + msg);
          }}
          rightBtnText={'No'}
          rightBtnOnClick={closeModal}
          hideLeftBtn={false}
        />
      </main>
    </>
  );
};

export default AdminDashboard;
