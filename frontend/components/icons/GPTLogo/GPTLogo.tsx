import Image from "next/image";

type Props = {
  className: string;
};

export default function GPTLogo({ className }: Props) {
  return (
    <Image 
      src = '/blackthornblack.png' 
      alt = 'blackthornlogo' 
      className = {className}
      width = {50}
      height = {50}
    />
  );
}
