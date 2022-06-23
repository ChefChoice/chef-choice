import Heading from '../../components/common/Heading';
import Image from 'next/image';
// import { compress, compressAccurately } from 'image-conversion';
import { useEffect, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/outline';

//TODO:
// - Make Fields larger on mobile + make tablet resolution more appealing
// - Image Compression for files > 1mb + error message

interface IDishFormProps {
  formName: string;
  dishId?: number;
  dishName?: string;
  hasImage: boolean;
  imageURL: string;
  dishPrice?: number;
  dishSection?: string;
  dishCategory?: string;
  dishIngredients?: string;
  dishDescription?: string;
}

const DishForm = ({
  formName,
  dishId,
  dishName,
  hasImage,
  imageURL,
  dishPrice,
  dishSection,
  dishCategory,
  dishIngredients,
  dishDescription,
}: IDishFormProps) => {
  const [previewURL, setPreviewURL] = useState<any>();
  const [imageError, setImageError] = useState<boolean>();
  // const [compressedImage, setCompressedImage] = useState<any>();

  useEffect(() => {
    setPreviewURL(imageURL);
  }, [previewURL]);

  useEffect(() => {
    setImageError(false);
  }, []);

  // const validateFileSize = (file: any) => {
  //   if (file.files[0].size > 1000000) {
  //     // alert for compression
  //     alert('Image will be compressed, >1mb');
  //     setCompressedImage(compressAccurately(file.files[0], 1000000));
  //     file.value = '';
  //   }
  // };

  return (
    <>
      <Heading title={formName} />
      <form action="/api/forms/dishForm" method="post" encType="multipart/form-data">
        <div className="grid gap-y-10 text-lg">
          <div className="grid grid-cols-10 grid-rows-2 place-items-center gap-y-10 lg:grid-rows-1 lg:place-items-start lg:p-5">
            <div className="col-span-10 lg:col-span-2">
              <div className="grid gap-3">
                <Image
                  src={imageURL}
                  alt={`Picture of ${dishName}`}
                  id="dishImg"
                  width={250}
                  height={250}
                  className="object-cover"
                />
                <div className="flex flex-col">
                  <label
                    htmlFor="upload"
                    className="h-12 w-full cursor-pointer rounded bg-green-light text-center text-white hover:bg-green-hover"
                    title="Upload Dish Image"
                  >
                    <p className="p-2">Upload Image...</p>
                  </label>
                  <input
                    type="file"
                    name="upload"
                    id="upload"
                    className="hidden"
                    accept="image/*"
                    required={!hasImage ? true : false}
                    onChange={(e) => {
                      if (e.target.files) {
                        let file = e.target.files[0];
                        let preview = document.getElementById('dishImg'); // can't use states here, srcSet overrides the image and you cannot send it as a prop to input (despite what the docs say)

                        if (preview) {
                          preview.setAttribute('src', URL.createObjectURL(file));
                          preview.setAttribute('srcset', URL.createObjectURL(file));
                          setImageError(false);
                        }
                      }
                    }}
                    onInvalid={() => {
                      setImageError(true);
                    }}
                    // onChange={(upload) => validateFileSize(upload.target)}
                  />
                  <p
                    id="imageErr"
                    className={`pt-3 text-center text-red-600 ${!imageError && 'hidden'}`}
                  >
                    Dish Image is Required.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-10 lg:col-span-7 lg:w-2/3 lg:pl-8">
              <div className="grid grid-rows-4 justify-items-center gap-5 text-center lg:justify-items-start lg:gap-4 lg:text-left">
                <div className="w-5/6 lg:w-2/3" title="Dish Name">
                  <label htmlFor="name">Dish name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={dishName}
                    className="w-full rounded border-2 border-x-0 border-t-0 border-gray-200 bg-gray-100 p-1 text-center hover:border-green-hover focus:border-green-hover focus:bg-white focus:outline-none lg:p-2 lg:text-left"
                    required
                    minLength={3}
                    maxLength={32}
                    onInvalid={(e) => {
                      let message =
                        e.currentTarget.value == ''
                          ? 'Having a dish name is required!'
                          : 'Dish name must be atleast 3 characters.';

                      e.currentTarget.setCustomValidity(message);
                    }}
                    onInput={(e) => {
                      e.currentTarget.setCustomValidity('');
                    }}
                  />
                </div>
                <div className="w-1/3" title="Dish Price">
                  <label htmlFor="price">Dish price</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    defaultValue={dishPrice}
                    className="w-full rounded border-2 border-x-0 border-t-0 border-gray-200 bg-gray-100 p-1 text-center hover:border-green-hover focus:border-green-hover focus:bg-white focus:outline-none lg:p-2 lg:text-left"
                    required
                    pattern="^\d*(\.\d{0,2})?$"
                    onInvalid={(e) => {
                      let message =
                        e.currentTarget.value == ''
                          ? 'Having a dish price is required!'
                          : 'Dish price must be atleast a dollar and limited to two decimal places.';

                      e.currentTarget.setCustomValidity(message);
                    }}
                    onInput={(e) => {
                      e.currentTarget.setCustomValidity('');
                    }}
                  />
                </div>
                <div className="w-5/6 lg:w-1/2" title="Marketplace section">
                  <div className="w-full">
                    <label htmlFor="section">Marketplace section</label>
                    <div className="flex content-around justify-between rounded border-2 border-x-0 border-t-0 border-gray-200 bg-gray-100 p-1 text-center hover:border-green-hover focus:border-green-hover lg:p-2 lg:text-left">
                      <input
                        type="text"
                        id="section"
                        name="section"
                        defaultValue={dishSection}
                        className="w-full grow bg-gray-100 p-1 focus:outline-none"
                        required
                        maxLength={32}
                      />
                      <div
                        className="self-end"
                        title="What section your dish will appear under when viewing your marketplace as a consumer."
                      >
                        <InformationCircleIcon className="mr-1 h-8 w-8 cursor-pointer stroke-1 hover:stroke-2" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-5/6 lg:w-1/2" title="Dish category">
                  <div className="w-full">
                    <label htmlFor="category">Dish category</label>
                    <div className="flex content-around justify-between rounded border-2 border-x-0 border-t-0 border-gray-200 bg-gray-100 p-1 text-center hover:border-green-hover focus:border-green-hover lg:p-2 lg:text-left">
                      <input
                        type="text"
                        id="category"
                        name="category"
                        defaultValue={dishCategory}
                        className="w-full grow bg-gray-100 p-1 focus:outline-none"
                        maxLength={32}
                      />
                      <div
                        className="self-end"
                        title="What category your dish will appear under when searching by category as a consumer."
                      >
                        <InformationCircleIcon className="mr-1 h-8 w-8 cursor-pointer  stroke-1 hover:stroke-2" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full" title="Dish ingredients">
                  <label htmlFor="ingredient">Ingredient(s)</label>
                  <input
                    type="text"
                    id="ingredient"
                    name="ingredient"
                    defaultValue={dishIngredients}
                    className="w-full rounded border-2 border-x-0 border-t-0 border-gray-200 bg-gray-100 p-1 text-center hover:border-green-hover focus:border-green-hover focus:bg-white focus:outline-none lg:p-2 lg:text-left"
                    maxLength={256}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid-rows-8 grid gap-6">
            <div className="row-span-6" title="Dish notes">
              <label htmlFor="details">Other notes</label>
              <textarea
                id="details"
                name="details"
                rows={4}
                defaultValue={dishDescription}
                className="w-full resize-none rounded border-2 border-gray-200 bg-gray-100 px-1 py-1 hover:border-green-hover focus:border-green-hover focus:bg-white focus:outline-none"
                maxLength={256}
              />
            </div>
            <div
              className=" row-span-2 flex h-12 w-1/3 justify-center place-self-center rounded bg-green-light text-center text-white hover:bg-green-hover"
              title="Submit Dish to Marketplace"
            >
              <button
                type="submit"
                onSubmit={() => {
                  URL.revokeObjectURL(previewURL); // dealloc
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        {dishId && <input type="hidden" name="id" value={dishId} />}
        {/* {compressedImage && <input type="hidden" name="uploadCompressed" value={compressedImage} />} */}
      </form>
    </>
  );
};

export default DishForm;
