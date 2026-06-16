export default function SignInLoading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-secondary tracking-wide uppercase animate-pulse font-sans">
          Loading Sign In...
        </span>
      </div>
    </div>
  );
}
