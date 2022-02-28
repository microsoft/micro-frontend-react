import { Text } from 'office-ui-fabric-react/lib/Text';

export const Container = styled.div`
    margin-top: 48px;
    margin-bottom: 48px;
    margin-left: 5%;
    margin-right: 5%;
`;

export const Space = styled.div`
    margin-bottom: 24px;
`;

export const PageHeading = styled(Text).attrs({
    as: 'h1',
    variant: 'xLarge',
    block: true
})`
    margin-bottom: 6px;
`;

export const PageDescription = styled(Text).attrs({
    as: 'p',
    block: true
})`
    margin-bottom: 24px;
`;

export const SectionTitle = styled(Text).attrs({
    as: 'h2',
    variant: 'large',
    block: true
})`
    margin-bottom: 24px;
`;
