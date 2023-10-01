import { H6, Input, YStack, YStackProps } from 'tamagui';
import { Theme } from './Theme';

type TextFieldProps = {
  label?: string;
  defaultValue?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  color?: Theme.Color;
  textContentType?:
    | 'none'
    | 'URL'
    | 'addressCity'
    | 'addressCityAndState'
    | 'addressState'
    | 'countryName'
    | 'creditCardNumber'
    | 'emailAddress'
    | 'familyName'
    | 'fullStreetAddress'
    | 'givenName'
    | 'jobTitle'
    | 'location'
    | 'middleName'
    | 'name'
    | 'namePrefix'
    | 'nameSuffix'
    | 'nickname'
    | 'organizationName'
    | 'postalCode'
    | 'streetAddressLine1'
    | 'streetAddressLine2'
    | 'sublocality'
    | 'telephoneNumber'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'oneTimeCode';
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
} & YStackProps;
export const TextField = ({
  label,
  value,
  onChange,
  defaultValue,
  placeholder,
  color = 'primary',
  multiline,
  keyboardType,
  textContentType,
  flex,
  ...props
}: TextFieldProps) => {
  return (
    <YStack gap='$2' flex={flex} {...props}>
      {!!label && <H6 color={`$${color}`}>{label}</H6>}
      <Input
        size='$6'
        pl='$3'
        borderWidth={1}
        bg='$foregroundTransparent'
        focusStyle={{
          borderColor: `$${color}`,
          borderWidth: 2,
        }}
        borderColor={`$${color}`}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={textContentType === 'emailAddress' || textContentType === 'password' ? 'none' : 'sentences'}
        textContentType={textContentType}
        color={`$${color}`}
        multiline={multiline}
        defaultValue={defaultValue}
        value={value}
        onChangeText={onChange}
        placeholderTextColor='rgba(0, 0, 0, 0.5)'
      />
    </YStack>
  );
};
