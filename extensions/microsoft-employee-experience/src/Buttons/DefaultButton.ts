import { ComponentType } from 'react';
import { DefaultButton as FabricDefaultButton } from '@fluentui/react/lib/Button';
import { IButtonProps } from './IButtonProps';
import { withButtonClickLogging } from './withButtonClickLogging';

export const DefaultButton = withButtonClickLogging<IButtonProps>(
    FabricDefaultButton as ComponentType<IButtonProps>
);
