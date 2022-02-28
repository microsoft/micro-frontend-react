import { ComponentType } from 'react';
import { ActionButton as FabricActionButton } from '@fluentui/react/lib/Button';
import { withButtonClickLogging } from './withButtonClickLogging';
import { IButtonProps } from './IButtonProps';

export const ActionButton = withButtonClickLogging<IButtonProps>(FabricActionButton as ComponentType<IButtonProps>);
