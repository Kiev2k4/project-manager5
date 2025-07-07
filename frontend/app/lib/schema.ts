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