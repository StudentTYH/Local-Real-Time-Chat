"use client";

import React, { useEffect,createContext,useState } from "react";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ellipsisMiddle } from "@/lib/utils";
import { AuthBanner } from "./authBanner";
import { Link , LockKeyhole } from "lucide-react";

import { ArrowUpRight } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useUserIn } from "./chat/user_info";



const AuthFormSchema = z.object({
  USER_ID: z.string().min(1, { message: "请输入学号！" }),
});

export function Auth() {
  const { pgState, dispatch, showAuthDialog, setShowAuthDialog } =
    usePlaygroundState();

  const onLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "SET_API_KEY", payload: null });
    setShowAuthDialog(true);
  };

  return (
    <div>
      {pgState.openaiAPIKey && (
        <div className="text-xs flex gap-2 items-center">
          <span className="font-semibold text-neutral-700">
            欢迎您：
          </span>
          <div className="py-1 px-2 rounded-md bg-neutral-200 text-neutral-600">
            {ellipsisMiddle(pgState.openaiAPIKey, 4, 4)}
          </div>
          <a className="hover:underline cursor-pointer" onClick={onLogout}>
            <Button>注销</Button>
          </a>

        </div>
      )}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthComplete={() => setShowAuthDialog(false)}
      />
    </div>
  );
}

export function AuthDialog({
  open,
  onOpenChange,
  onAuthComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthComplete: () => void;
}) {


  const { data,setUserid } = useUserIn();  



  const { pgState, dispatch } = usePlaygroundState();
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      USER_ID: pgState.openaiAPIKey || "",
    },
  });

  // Add this useEffect hook to watch for changes in pgState.openaiAPIKey
  useEffect(() => {
    form.setValue("USER_ID", pgState.openaiAPIKey || "");
  }, [pgState.openaiAPIKey, form]);

  // function onSubmit(values: z.infer<typeof AuthFormSchema>) {
  //   dispatch({ type: "SET_API_KEY", payload: values.USER_ID || null });
  //   onOpenChange(false);
  //   onAuthComplete();
  // }

  function onSubmit(values: z.infer<typeof AuthFormSchema>) {
    // const [userId, setUserId] = useState<string | null>("0");

    setUserid(values.USER_ID);

    // 发送到后端 API 路由
    fetch('http://localhost:8765/set_id', {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        USER_ID: values.USER_ID || null, // 发送 USER_ID
      }),
    })
      .then(response => response.json())
      .then(data => {
        alert("欢迎您："+data["name"]+"同学。");
        console.log('Server response:', data);
        // 如果请求成功，执行一些后续操作
        dispatch({ type: "SET_API_KEY", payload: values.USER_ID || null });
        onOpenChange(false);
        onAuthComplete();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md p-0 border-0 rounded-lg overflow-hidden max-h-[90vh] flex flex-col"
        isModal={true}
      >
        <div className="overflow-y-auto">
          {/* <AuthBanner /> */}
          <div className="px-6 pb-6 pt-4 overflow-y-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <DialogHeader className="gap-2">
                  <DialogTitle>欢迎来到心理评估对话系统</DialogTitle>
                  <DialogDescription>
                    注意事项：
                  </DialogDescription>

                </DialogHeader>
                <div className="bg-black/10 h-[1px] w-full" />
                <FormField
                  control={form.control}
                  name="USER_ID"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-2">
                        <FormLabel className="font-semibold text-sm whitespace-nowrap">
                          请输入您的学号{" "}
                        </FormLabel>
                        <div className="flex gap-2 w-full">
                          <FormControl className="w-full">
                            <Input
                              className="w-full"
                              placeholder="学号 . . ."
                              {...field}
                            />
                          </FormControl>
                          <Button type="submit">Connect</Button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogDescription className="text-xs py-2 flex justify-between items-center">
                  <div className="flex items-center gap-2 flex-1">
                    <LockKeyhole className="h-3 w-3 flex-shrink-0" />
                    {/* <span className="font-semibold">
                      Your key is stored only in your browser&apos;s
                      LocalStorage.
                    </span> */}
                  </div>

                  <div className="flex items-center flex-1 justify-end">
                    <a
                      href="https://github.com/livekit-examples/realtime-playground"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline flex items-center gap-1"
                    >
                      {/* <GitHubLogoIcon className="h-5 w-5" />
                      View source on GitHub */}
                    </a>
                  </div>
                </DialogDescription>
              </form>
            </Form>
          </div>
          <div className="h-[45vh] sm:h-0"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
