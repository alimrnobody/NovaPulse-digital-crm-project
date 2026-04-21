import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast border border-white/10 bg-slate-900 text-slate-100 shadow-2xl",
          description: "group-[.toast]:text-slate-400",
          actionButton: "group-[.toast]:bg-indigo-500 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-300",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
