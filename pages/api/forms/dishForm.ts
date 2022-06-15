import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import { parseCookies } from 'nookies';
import { nanoid } from 'nanoid';
import fs from 'fs';
import multiparty from 'multiparty';

//TODO:
// - Input Sanitization
// - Proper status code resolution and error messages
// - Image Upsert to reduce usage space
// - Add onConflict for dish names?
// - Move out of file to general utils?

const setSession = async (req: NextApiRequest) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  const token = parseCookies({ req })['sb-access-token'];

  if (user) {
    supabase.auth.session = () => ({
      user: user,
      access_token: token,
      token_type: 'Bearer',
    });
    return user;
  } else {
    throw error;
  }
};

const upsertDish = async (formFields: any) => {
  return new Promise(async (resolve, reject) => {
    const { error } = await supabase.from('Dish').upsert([
      {
        user_id: formFields.userId,
        ...(formFields.id && { dish_id: parseInt(formFields.id) }),
        ...(formFields.dishImage && { dish_image: formFields.dishImage }),
        dish_name: formFields.name.toString(),
        dish_price: parseFloat(formFields.price),
        dish_category: formFields.category.toString() ?? null,
        dish_ingredients: formFields.ingredient.toString() ?? null,
        dish_description: formFields.details.toString() ?? null,
      },
    ]);

    if (error) {
      console.error(error);
      return reject(error);
    }
    return resolve('');
  });
};

const uploadDishImage = async (formData: any) => {
  return new Promise((resolve, reject) => {
    if (formData.fields.id) {
      formData.fields.dishImage = null;
      return resolve(formData.fields);
    }

    const imageFile = formData.files.upload[0];
    const imageType = imageFile.headers['content-type'];
    const { originalFilename } = imageFile;
    const dishImageFilename = nanoid() + '.' + originalFilename.split('.').pop();
    const serverFilePath = `${dishImageFilename}`;

    fs.readFile(imageFile.path, async (error, image) => {
      if (error) return reject(error.message);

      await supabase.storage
        .from('dish-images')
        .upload(serverFilePath, image, { contentType: imageType })
        .catch((error) => {
          console.error(error);
          return reject(error);
        })
        .then(() => {
          formData.fields.dishImage = dishImageFilename;
          return resolve(formData.fields);
        });
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // if (formUser.uploadCompressed) {
  //   formUser.upload = formUser.uploadCompressed;
  // console.log(formUser.uploadCompressed);
  // }
  // const imageName = uploadDishImage(user.id, formUser.upload.split('.').pop(), formUser.upload);

  await setSession(req)
    .then(async (user) => {
      const form = new multiparty.Form();
      await new Promise((resolve, reject) => {
        form.parse(req, function (error, fields, files) {
          fields.userId = user.id;
          if (error) reject(error);
          resolve({ fields, files });
        });
      })
        .then(uploadDishImage)
        .then(upsertDish)
        .then(() => {
          return res.status(200).redirect('/dish-management');
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).redirect('/dish-management');
        });
    })
    .catch((error) => {
      console.error(error);
      return res.status(401).redirect('/');
    });
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
