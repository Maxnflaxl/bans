import React from 'react';
import { styled } from '@linaria/react';
import { ButtonVariant, Pallete } from '@core/types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.FC;
  pallete?: Pallete;
  variant?: ButtonVariant;
  width?: string;
  height?: string;
}

const BaseButtonStyled = styled.button<ButtonProps>`
  &[disabled] {
    opacity: 0.5;

    &:hover,
    &:active {
      box-shadow: none !important;
      cursor: not-allowed !important;
    }
  }
`;

const ButtonStyled = styled(BaseButtonStyled)`
  display: block;
  width: 100%;
  max-width: 254px;
  margin: 0 auto;
  margin-bottom: 10px;
  padding: 10px 24px;
  border: none;
  border-radius: 22px;
  background-color: ${({ pallete }) => `var(--color-${pallete})`};
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: var(--color-dark-blue);

  &:hover,
  &:active {
    box-shadow: 0 0 8px white;
    cursor: pointer;
  }

  > svg {
    vertical-align: middle;
    margin-right: 10px;
  }
`;

const GhostButtonStyled = styled(ButtonStyled)`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;

  &:hover,
  &:active {
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const BlockButtonStyled = styled(GhostButtonStyled)`
  width: 100%;
  max-width: none;
  padding: 18px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.03);
  font-size: 14px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: ${({ pallete }) => `var(--color-${pallete})`};

  &:hover,
  &:active {
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
`;

const IconButtonStyled = styled(BaseButtonStyled)`
  font-family: 'SFProDisplay', sans-serif;
  display: inline-block;
  vertical-align: sub;
  margin: ${({ pallete }) => `0 0 0 ${pallete === 'transparent' ? '0px' : '10px'}`};
  font-size: 14px;
  border: none;
  cursor: pointer;
  user-select: none;
  background-color: rgba(255,255,255, 0.05);
  color: ${({ pallete }) => `var(--color-${pallete})`};
  padding: 0;
  width: ${({ width }) => `${width}`};
  height: ${({ height }) => `${height}`};
  flex-shrink: 0;
  border-radius: 10px;
  > svg {
    vertical-align: middle;
  }

  > svg {
    vertical-align: sub;
  }
`;

const LinkButtonStyled = styled(IconButtonStyled)`
  margin: 20px 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ pallete }) => `var(--color-${pallete})`};
`;

const VARIANTS = {
  regular: ButtonStyled,
  ghost: GhostButtonStyled,
  link: LinkButtonStyled,
  icon: IconButtonStyled,
  block: BlockButtonStyled,
};

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  pallete = 'green',
  variant = 'regular',
  icon: IconComponent,
  children,
  ...rest
}) => {
  const ButtonComponent = VARIANTS[variant];

  return (
    <ButtonComponent type={type} pallete={pallete} {...rest}>
      {!!IconComponent && <IconComponent />}
      {children}
    </ButtonComponent>
  );
};

export default Button;