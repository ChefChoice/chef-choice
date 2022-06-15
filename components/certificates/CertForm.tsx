import { User } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import Heading from '../../components/common/Heading';
import { Certificate } from '../../models/Certificate';
import { supabase } from '../../utils/supabaseClient';

interface ICertForm {
  formName: string;
  certificate: Certificate | null;
}

export const CertForm = ({ formName, certificate }: ICertForm) => {
  const [name, setName] = useState(certificate ? certificate.name : '');
  const [type, setType] = useState(certificate ? certificate.type : '');
  const [awardedBy, setAwardedBy] = useState(certificate ? certificate.awardedBy : '');
  const [date, setDate] = useState(certificate ? certificate.date.toString() : '');
  const [expirydate, setExpirydate] = useState(
    certificate ? certificate.expirydate.toString() : ''
  );
  const [imagePath, setImagePath] = useState(certificate ? certificate.image : '');

  const { push } = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(supabase.auth.user());
  }, []);

  async function uploadImage(event: any) {
    const submitBtn = document.getElementById('submitBtn');

    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      // disable submit button until image is uploaded
      submitBtn?.setAttribute('disabled', 'true');

      if (user) {
        const file = event.target.files[0];

        // Check if no image, upload.
        // Otherwise, replace the existing image with the new one (retain the imagePath)
        if (!imagePath) {
          const fileExt = file.name.split('.').pop();

          // Folder level access for authenticated user
          // Format of the file path: Bucket/user.id/filename
          const imagePath = `${nanoid()}.${fileExt}`;
          const fullImagePath = `${user.id}/${imagePath}`;

          const { error: uploadError } = await supabase.storage
            .from('cert-images')
            .upload(fullImagePath, file);

          if (uploadError) {
            throw uploadError;
          } else {
            setImagePath(imagePath);
          }
        } else {
          const { error } = await supabase.storage
            .from('cert-images')
            .update(`${user.id}/${imagePath}`, file, {
              cacheControl: '0',
            });
          if (error) {
            throw error;
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      // release submit button
      submitBtn?.removeAttribute('disabled');
    }
  }

  const submitCertificate = async (e: any) => {
    e.preventDefault();

    const { data, error } = await supabase.from('Certificate').upsert([
      {
        ...(certificate?.id && { id: certificate.id }),
        homechef_id: user?.id,
        name: name,
        type: type === '1' ? 'Required' : 'Optional',
        awardedBy: awardedBy,
        date: date,
        expirydate: expirydate,
        image: imagePath,
      },
    ]);

    if (error) {
      throw error;
    }

    push('/profile');
  };

  const getMinExpiryDate = () => {
    const minExpiryDate = new Date();
    minExpiryDate.setDate(minExpiryDate.getDate() + 15);

    return minExpiryDate.toLocaleDateString('en-ca');
  };

  return (
    <>
      <Heading title={formName} optionalNode={null} optionalNodeRightAligned={true} />

      <form onSubmit={submitCertificate}>
        <div className="grid grid-rows-6 grid-flow-col gap-2 py-5 text-lg justify-center">
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            <label
              className="grid col-span-1 col-start-1 sm:col-start-2 mb-4 justify-start place-content-center"
              htmlFor="name"
            >
              Certificate Name
            </label>
            <input
              className="grid col-span-3 sm:col-span-2 rounded px-3 py-2 mb-4 mx-2 border-black border-2 hover:border-green-light focus:outline-none focus:border-green-light"
              id="name"
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              autoFocus={true}
              required
            />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            <label
              className="grid col-span-1 col-start-1 sm:col-start-2 justify-start place-content-center"
              htmlFor="awardedBy"
            >
              Awarded By
            </label>
            <input
              className="grid col-span-3 sm:col-span-2 rounded px-3 py-2 mb-4 mx-2 border-black border-2 hover:border-green-light focus:outline-none focus:border-green-light"
              id="awardedBy"
              type="text"
              value={awardedBy}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAwardedBy(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            <label
              className="grid col-span-1 col-start-1 sm:col-start-2 mb-4 justify-start place-content-center"
              htmlFor="date"
            >
              Date
            </label>
            <input
              className="col-span-3 sm:col-span-2 rounded px-3 py-2 mb-4 mx-2 border-black border-2 hover:border-green-light focus:outline-none focus:border-green-light"
              id="date"
              type="date"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            <label
              className="grid col-span-1 col-start-1 sm:col-start-2 mb-4 justify-start place-content-center"
              htmlFor="expirydate"
            >
              Valid Until
            </label>
            <input
              className="col-span-3 sm:col-span-2 rounded px-3 py-2 mb-4 mx-2 border-black border-2 hover:border-green-light focus:outline-none focus:border-green-light"
              id="expirydate"
              type="date"
              min={getMinExpiryDate()}
              value={expirydate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setExpirydate(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            <p className="grid col-span-1 col-start-1 sm:col-start-2 justify-start">
              Is it Food Handler Certificate?
            </p>
            <div className="col-span-1">
              <div>
                <input
                  className="form-check-input mx-2"
                  name="certType"
                  id="Required"
                  type="radio"
                  value={'1'}
                  required
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="Required">
                  Yes
                </label>
              </div>
              <div>
                <input
                  className="form-check-input mx-2"
                  id="Optional"
                  name="certType"
                  type="radio"
                  value={'0'}
                  required
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setType(e.target.value)}
                />
                <label className="form-check-label" htmlFor="Optional">
                  No
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 place-content-center">
            <label
              className="grid col-span-1 col-start-1 sm:col-start-2 justify-start place-content-center"
              htmlFor="cert_image"
            >
              {certificate ? 'Upload new certificate?' : 'Upload your certificate'}
            </label>
            <input
              className="grid col-span-3 sm:col-span-2 rounded py-2 mx-2"
              id="cert_image"
              type="file"
              accept="image/*"
              onChange={uploadImage}
              required={certificate && imagePath ? false : true} // required for Add, not required for Edit
            />
          </div>
        </div>
        <div className="grid justify-center">
          <button
            id="submitBtn"
            className="py-3 px-3 my-2 mx-2 sm:px-20 justify-center text-lg bg-green-light hover:bg-green-hover border-green-light hover:border-green-hover text-white rounded"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};