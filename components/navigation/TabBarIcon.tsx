import Entypo from "@expo/vector-icons/Entypo";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";

// Новый компонент для иконок Entypo
export function TabBarIcon({
  style,
  ...rest
}: IconProps<ComponentProps<typeof Entypo>["name"]>) {
  return <Entypo size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
}
