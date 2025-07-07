<<<<<<< HEAD
import {z} from 'zod';

export const signInSchema = z.object({
    email:z.string().email("Email không hợp lệ"),
    password:z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const signUpSchema = z.object({
    name:z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
    email:z.string().email("Email không hợp lệ"),
    password:z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword:z.string().min(6, "Mật khẩu xác nhận sai"),
}).refine((data) => data.password === data.confirmPassword, {
    path:["confirmPassword"],
    message:"Mật khẩu xác nhận không khớp",
});
=======
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password is required"),
});

export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be 8 characters"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    confirmPassword: z.string().min(8, "Password must be 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
>>>>>>> b38199024ef57ad9523346d853440ab306a1c436
