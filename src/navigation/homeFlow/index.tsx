import { createNativeStackNavigator } from '@react-navigation/native-stack';

const HomeStack = createNativeStackNavigator();
export const AuthNavigation = () => {
  return <HomeStack.Navigator></HomeStack.Navigator>;
};
