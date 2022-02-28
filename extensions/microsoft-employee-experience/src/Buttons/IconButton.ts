import { ComponentType } from 'react';
import { IconButton as FabricIconButton } from '@fluentui/react/lib/Button';
import { withButtonClickLogging } from './withButtonClickLogging';
import { IButtonProps } from './IButtonProps';

export const IconButton = withButtonClickLogging<IButtonProps>(FabricIconButton as ComponentType<IButtonProps>);
