interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-[#fb5151]/10 rounded-3xl text-center px-6 mt-6">
      <div className="w-16 h-16 bg-[#fb5151] text-white rounded-full flex items-center justify-center mb-4">
        <span className="material-symbols-outlined">error</span>
      </div>
      <h3 className="font-[Epilogue] font-bold text-xl text-[#4b240a]">Connection lost</h3>
      <p className="font-[Manrope] text-[#805032] mt-2 mb-6 text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="px-8 py-3 bg-[#a33800] text-white font-[Epilogue] font-bold rounded-full shadow-lg shadow-[#a33800]/20 active:scale-95 transition-transform"
      >
        Retry Connection
      </button>
    </div>
  );
}
