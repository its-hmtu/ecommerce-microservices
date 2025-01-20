type PropsTypes = {
  size?: "text-2xl" | "text-xl" | "text-lg" | "text-md" | "text-sm";
};

function Logo({ size }: PropsTypes) {
  return (
    <h1 className={`${size} font-bold`}>
      Online<span className="font-light">Boutique</span>
    </h1>
  );
}

export default Logo;
