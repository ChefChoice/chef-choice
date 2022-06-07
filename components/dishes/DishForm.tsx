import Heading from '../../components/common/Heading';
import Image from 'next/image';
// import { compress, compressAccurately } from 'image-conversion';
import { useEffect, useState } from 'react';

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
          <div className="grid grid-rows-2 lg:grid-rows-1 grid-cols-10 gap-y-10 place-items-center lg:place-items-start lg:p-5">
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
                    className="text-center text-white rounded w-full h-12 bg-green-light hover:bg-green-hover cursor-pointer"
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
                    className={`text-center text-red-600 pt-3 ${!imageError && 'hidden'}`}
                  >
                    Dish Image is Required.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-10 lg:col-span-7 lg:pl-8 lg:w-2/3">
              <div className="grid grid-rows-4 gap-3 lg:gap-0 text-center">
                <div className="grid grid-rows-2 justify-items-center justify-self-center lg:justify-items-start lg:justify-self-start w-5/6 lg:w-2/3">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={dishName}
                    className="w-full p-1 lg:p-2 bg-gray-100 rounded border-gray-200 border-2 border-x-0 border-t-0 hover:border-green-hover focus:outline-none focus:bg-white focus:border-green-hover text-center lg:text-left"
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
                  <label htmlFor="name">Dish name</label>
                </div>
                <div className="grid grid-rows-2 justify-items-center justify-self-center lg:justify-items-start lg:justify-self-start w-1/3 lg:w-1/5">
                  <label htmlFor="price">Dish price</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    defaultValue={dishPrice}
                    className="w-full p-1 lg:p-2 bg-gray-100 rounded border-gray-200 border-2 border-x-0 border-t-0 hover:border-green-hover focus:outline-none focus:bg-white focus:border-green-hover text-center lg:text-left"
                    required
                    pattern="^\d*(\.\d{0,2})?$"
                    onInvalid={(e) => {
                      let message =
                        e.currentTarget.value == ''
                          ? 'Having a dish price is required!'
                          : 'Dish price must be atleast dollar and limited to two decimal places.';

                      e.currentTarget.setCustomValidity(message);
                    }}
                    onInput={(e) => {
                      e.currentTarget.setCustomValidity('');
                    }}
                  />
                </div>
                <div className="lg:text-left">
                  <label htmlFor="category">Dish category(s)</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    defaultValue={dishCategory}
                    className="w-full p-1 lg:p-2 bg-gray-100 rounded border-gray-200 border-2 border-x-0 border-t-0 hover:border-green-hover focus:outline-none focus:bg-white focus:border-green-hover text-center lg:text-left"
                    maxLength={256}
                  />
                </div>
                <div className="lg:text-left">
                  <label htmlFor="ingredient">Ingredient(s)</label>
                  <input
                    type="text"
                    id="ingredient"
                    name="ingredient"
                    defaultValue={dishIngredients}
                    className="w-full p-1 lg:p-2 bg-gray-100 rounded border-gray-200 border-2 border-x-0 border-t-0 hover:border-green-hover focus:outline-none focus:bg-white focus:border-green-hover text-center lg:text-left"
                    maxLength={256}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-rows-8 gap-6">
            <div className="row-span-6">
              <label htmlFor="details">Other notes</label>
              <textarea
                id="details"
                name="details"
                rows={4}
                defaultValue={dishDescription}
                className="w-full px-1 py-1 bg-gray-100 rounded border-gray-200 border-2 hover:border-green-hover focus:outline-none focus:bg-white focus:border-green-hover resize-none"
                maxLength={256}
              />
            </div>
            <button
              type="submit"
              className="row-span-2 rounded w-1/3 h-12 bg-green-light hover:bg-green-hover justify-center place-self-center text-white"
              onSubmit={() => {
                URL.revokeObjectURL(previewURL); // dealloc
              }}
            >
              Submit
            </button>
          </div>
        </div>
        {dishId && <input type="hidden" name="id" value={dishId} />}
        {/* {compressedImage && <input type="hidden" name="uploadCompressed" value={compressedImage} />} */}
      </form>
    </>
  );
};

export default DishForm;
