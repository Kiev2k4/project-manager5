import React from "react";
import { signUpSchema } from "@/lib/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import Link from "next/link";

export type SignUpFormData = z.infer<typeof signUpSchema>;
function SignUp() {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const handleOnSubmit = (values: SignUpFormData) => {
    console.log(values);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Tạo một tài khoản
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground text-center ">
            Vui lòng nhập thông tin đăng ký của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và Tên</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Họ và Tên" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Địa chỉ Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Mật Khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="*********"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <Button
                type="submit"
                className="w-full mt-6 bg-blue-500 active:bg-black active:text-white transition-colors"
              >
                Đăng Ký
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <div className="flex items-center justify-center ">
            <p className="text-sm text-muted-foreground">
              Bạn đã có tài khoản?
              <a href="/sign-in" className="text-blue-500">
                Đăng nhập
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}


export default SignUp;
