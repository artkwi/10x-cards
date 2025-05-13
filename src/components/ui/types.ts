import type { ComponentPropsWithoutRef } from "react";

export type InputProps = ComponentPropsWithoutRef<"input">;

export interface LabelProps extends ComponentPropsWithoutRef<"label"> {
  htmlFor?: string;
}

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export interface AlertProps extends ComponentPropsWithoutRef<"div"> {
  variant?: "default" | "destructive";
}

export type AlertDescriptionProps = ComponentPropsWithoutRef<"div">;

export type CardProps = ComponentPropsWithoutRef<"div">;
export type CardHeaderProps = ComponentPropsWithoutRef<"div">;
export type CardFooterProps = ComponentPropsWithoutRef<"div">;
export type CardContentProps = ComponentPropsWithoutRef<"div">;
export type CardTitleProps = ComponentPropsWithoutRef<"h3">;
