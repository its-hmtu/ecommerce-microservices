type PropsTypes = {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
};

function Logo({ size = "2xl"}: PropsTypes) {
  return (
    <h1 className={`text-${size} font-bold`}>
      Online<span className="font-light">Boutique</span>
    </h1>
  );
}

export default Logo;
