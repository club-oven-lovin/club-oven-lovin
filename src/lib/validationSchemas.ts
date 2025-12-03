import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const AddRecipeSchema = Yup.object({
  name: Yup.string().required(),
  image: Yup.string().required(),
  ingredients: Yup.string().required(),
  steps: Yup.string().required(),
  tags: Yup.string().required(),
  dietaryRestrictions: Yup.array()
    .of(Yup.string().required())
    .default([])
    .required(),
  owner: Yup.string().required(), // This is the field that was causing the issue
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditRecipeSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  image: Yup.string().required(),
  ingredients: Yup.string().required(),
  steps: Yup.string().required(),
  tags: Yup.string().required(),
  dietaryRestrictions: Yup.array().of(Yup.string()),
  owner: Yup.string().required(),
});

export const EditProfileSchema = Yup.object({
  id: Yup.string().required(),
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  image: Yup.string().default(''),
  dietaryRestrictions: Yup.array().of(Yup.string().required()).default([]),
});
