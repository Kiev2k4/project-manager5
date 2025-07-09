import React from "react";
import { signInSchema } from "@/lib/schema";
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
import { useLoginMutation } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/provider/auth-context";
// import Link from "next/link";



type SignInFormData = z.infer<typeof signInSchema>;
function SignIn() {
  const navigate = useNavigate();
  const {login} = useAuth();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {mutate, isPending} = useLoginMutation();

  const handleOnSubmit = (values: SignInFormData) => {
    mutate(values, {
      onSuccess: (data) => {
        login(data);
        console.log(data);
        toast.success("Login successful");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        const errorMessage = 
          error.response?.data?.message || "An error occurred";
        console.log(error);
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Đăng Nhập
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground text-center ">
            Vui lòng nhập thông tin đăng nhập của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Mật Khẩu</FormLabel>
                      <a href="/forgot-password" className="text-sm  text-blue-600">
                        Quên mật khẩu?
                      </a>
                    </div>
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
              
              <Button type="submit" className="w-full mt-6 bg-blue-500 active:text-white transition-colors" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 mr-2"/> : "Đăng Nhập"}
              </Button>

            </form>
          </Form>
          <CardFooter className="flex items-center justify-center">
            <div className="flex items-center justify-center mt-4">
              <p className="text-sm text-muted-foreground">
                Bạn chưa có tài khoản?{" "}
                <a href="/sign-up" className="text-blue-500">
                  Đăng ký
                </a>
              </p>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignIn;

