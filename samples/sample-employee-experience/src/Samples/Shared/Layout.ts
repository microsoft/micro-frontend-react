import { Text } from '@fluentui/react/lib/Text';

export const Container = styled.div`
  margin: 48px 5%;
`;

export const Space = styled.div`
  margin-bottom: 24px;
`;

export const PageHeading = styled(Text).attrs({
  as: 'h1',
  variant: 'xLarge',
  block: true,
})`
  margin-bottom: 6px;
`;

export const PageDescription = styled(Text).attrs({
  as: 'p',
  block: true,
})`
  margin-bottom: 24px;
`;

export const SectionTitle = styled(Text).attrs({
  as: 'h2',
  variant: 'large',
  block: true,
})`
  margin-bottom: 24px;
`;
