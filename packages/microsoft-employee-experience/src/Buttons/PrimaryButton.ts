import { ComponentType } from 'react';
import { PrimaryButton as FabricPrimaryButton } from '@fluentui/react/lib/Button';
import { IButtonProps } from './IButtonProps';
import { withButtonClickLogging } from './withButtonClickLogging';

export const PrimaryButton = withButtonClickLogging<IButtonProps>(FabricPrimaryButton as ComponentType<IButtonProps>);
