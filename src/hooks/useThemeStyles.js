import { useTheme } from "../context";

export const useThemeStyles = () => {
  const { theme } = useTheme();

  return {
    bgColor: theme === "dark" ? "bg-[#080808]" : "bg-[#F9FAFB]",
    textColor: theme === "dark" ? "text-white" : "text-neutral-900",
    inputBg: theme === "dark" ? "bg-neutral-900" : "bg-white",
    inputBorder: theme === "dark" ? "border-neutral-800" : "border-neutral-200",
    buttonBg: theme === "dark" ? "bg-white text-neutral-900" : "bg-black text-white"
  };
};
