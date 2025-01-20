type PropsTypes = {
  size?: "text-2xl" | "text-xl" | "text-lg" | "text-md" | "text-sm";
  underline?: boolean;
};

function Logo({ size, underline }: PropsTypes) {
  return (
    <h1 className={`${size} font-bold hover:text-black hover:underline hover:decoration-blue-500 ${underline ? "underline decoration-blue-500" : ""}`}>
      Online<span className="font-light">Boutique</span>
    </h1>
  );
}

export default Logo;
