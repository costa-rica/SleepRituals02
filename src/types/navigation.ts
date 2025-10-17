import type {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type RootStackParamList = {
	Splash: undefined;
	GoodTimes: undefined;
};

export type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;

// Screen-specific prop helpers
// explaination: NativeStackScreenProps<...> — a utility type that produces:
// -- navigation.navigate('GoodTimes') is type-checked
// -- route.params is typed (for Splash it’s undefined).
export type SplashScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"Splash"
>;

export type GoodTimesProps = NativeStackScreenProps<
	RootStackParamList,
	"GoodTimes"
>;
