import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { User } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import Heading from '../../components/common/Heading';
import { supabase } from '../../utils/supabaseClient';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

export default function AddCertificate() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [awardedBy, setAwardedBy] = useState('');
  const [date, setDate] = useState('');
  const [expirydate, setExpirydate] = useState('');
  const [imagePath, setImagePath] = useState('');

  const { push, query } = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(supabase.auth.user());
  }, []);

  async function uploadImage(event: any) {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      if (user) {
        const file = event.target.files[0];
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
      }
    } catch (err) {
      console.log(err);
    }
  }

  const addCertificate = async (e: any) => {
    e.preventDefault();

    const { data, error } = await supabase.from('Certificate').insert([
      {
        homechef_id: query.id,
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
      <Head>
        <title>Add Certificate</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <main className="flex flex-col h-screen w-full py-10 px-10 mx-auto">
        <Heading title={'Add Certificate'} optionalNode={null} optionalNodeRightAligned={true} />

        <form onSubmit={addCertificate}>
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
                Upload your certificate
              </label>
              <input
                className="grid col-span-3 sm:col-span-2 rounded py-2 mx-2"
                id="cert_image"
                type="file"
                accept="image/*"
                onChange={uploadImage}
                required
              />
            </div>
          </div>
          <div className="grid justify-center">
            <button
              className="py-3 px-3 my-2 mx-2 sm:px-20 justify-center text-lg bg-green-light hover:bg-green-hover border-green-light hover:border-green-hover text-white rounded"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
