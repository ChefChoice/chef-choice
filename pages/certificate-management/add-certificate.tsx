import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import Header from '../../components/common/Heading';
import { supabase } from '../../utils/supabaseClient';

export default function AddCertificate() {
  const [name, setName] = useState('');
  const [awardedBy, setAwardedBy] = useState('');
  const [date, setDate] = useState('');
  const [expirydate, setExpirydate] = useState('');
  const [imagePath, setImagePath] = useState('');

  const { push, query } = useRouter();

  async function uploadImage(event: any) {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cert-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      } else {
        setImagePath(filePath);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // TODO: check imagePath not set yet
  const addCertificate = async (e: any) => {
    e.preventDefault();

    const { data, error } = await supabase.from('Certificate').insert([
      {
        homechef_id: query.id,
        name: name,
        type: 'Optional',
        awardedBy: awardedBy,
        date: date,
        expirydate: expirydate,
        image: imagePath,
      },
    ]);

    push('/profile');
  };

  return (
    <>
      <Head>
        <title>Add Certificate</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <main className="flex flex-col h-screen w-full py-10 px-10">
        <Header title={'Add Certificate'} optionalNode={null} optionalNodeRightAligned={true} />

        <form onSubmit={addCertificate} className="mb-2">
          <div className="grid grid-rows-6 grid-flow-col gap-2 text-xl">
            <div className="grid grid-cols-5 gap-2 justify-center">
              <label
                className="grid col-span-1 col-start-2 mb-4 justify-start place-content-center"
                htmlFor="name"
              >
                Certificate Name
              </label>
              <input
                className="grid col-span-2 rounded px-3 py-2 mb-4 mr-2 border-black border-2 hover:border-green-light focus:outline-none focus:border-green-light"
                id="name"
                type="text"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                autoFocus={true}
                required
              />
            </div>
            <div className="grid grid-cols-5 gap-2 justify-center">
              <label
                className="grid col-span-1 col-start-2 mb-4 justify-start place-content-center"
                htmlFor="awardedBy"
              >
                Awarded By
              </label>
              <input
                className="grid col-span-2 rounded px-3 py-2 mb-4 mr-2 border-black border-2 hover:border-green-light focus:outline-none focus:border-green-light"
                id="awardedBy"
                type="text"
                value={awardedBy}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAwardedBy(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-5 gap-2 justify-center">
              <label
                className="grid col-span-1 col-start-2 mb-4 justify-start place-content-center"
                htmlFor="date"
              >
                Date
              </label>
              <input
                className="grid col-span-2 rounded px-3 py-2 mb-4 mr-2 border-black border-2 hover:border-green-light focus:outline-none focus:border-green-light"
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-5 gap-2 justify-center">
              <label
                className="grid col-span-1 col-start-2 mb-4 justify-start place-content-center"
                htmlFor="expirydate"
              >
                Valid Until
              </label>
              <input
                className="grid col-span-2 rounded px-3 py-2 mb-4 mr-2 border-black border-2 hover:border-green-light focus:outline-none focus:border-green-light"
                id="expirydate"
                type="date"
                value={expirydate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setExpirydate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-5 gap-2 justify-center  place-content-center">
              <label className="grid col-span-1 col-start-2 justify-start" htmlFor="cert_image">
                Upload your certificate
              </label>
              <input
                className="grid col-span-2 rounded py-2 mr-2"
                id="cert_image"
                type="file"
                accept="image/*"
                onChange={uploadImage}
                required
              />
            </div>
            <div className="grid grid-cols-5 gap-2 justify-center pb-3">
              <button
                className="grid col-span-1 col-start-3 place-content-center px-3 py-2 mr-2 mb-4 max-w-sm bg-green-light hover:bg-green-hover border-green-light hover:border-green-hover text-white rounded"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
