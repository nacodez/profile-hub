export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export interface BasicDetails {
    salutation?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImageUrl?: string;
}

export interface AdditionalDetails {
    address?: string;
    country?: string;
    postalCode?: string;
    dob?: string;
    gender?: string;
    maritalStatus?: string;
}

export interface SpouseDetails {
    salutation?: string;
    firstName?: string;
    lastName?: string;
}

export interface Preferences {
    hobbies?: string;
    sports?: string;
    music?: string;
    movies?: string;
}

export interface ProfileFormData {
    basicDetails?: BasicDetails;
    additionalDetails?: AdditionalDetails;
    spouseDetails?: SpouseDetails;
    preferences?: Preferences;
}

export interface ProtectedRouteProps {
    children: React.ReactNode;
}

export interface AuthProviderProps {
    children: React.ReactNode;
}

export interface HeaderProps {
    variant?: "home" | "profile" | "login";
    onProfileEdit?: (mode?: "view" | "edit") => void;
}

export interface CustomTextFieldProps extends Omit<import('@mui/material').TextFieldProps, "label"> {
    label: string;
}

export interface CustomSelectProps extends Omit<import('@mui/material/Select').SelectProps, "label"> {
    label: string;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    formControlProps?: Omit<import('@mui/material').FormControlProps, "error" | "fullWidth">;
}

export interface LoginFormProps {
    onSuccess: () => void;
    onError: (error: string) => void;
}

export interface RegisterFormProps {
    onSuccess: () => void;
    onError: (error: string) => void;
}


export interface BasicDetailsProps {
    data?: Partial<BasicDetails>;
    onUpdate: (values: BasicDetails) => void;
}

export interface AdditionalDetailsProps {
    data?: Partial<AdditionalDetails>;
    onUpdate: (values: AdditionalDetails) => void;
}

export interface SpouseDetailsProps {
    data?: Partial<SpouseDetails>;
    onUpdate: (values: SpouseDetails) => void;
}

export interface FeatureCard {
    title: string;
    description: string;
    iconName: string;
    order: number;
}

export interface HeroSection {
    title: string;
    description: string;
}

export interface HomepageContent {
    heroSection: {
        title: string;
        description: string;
    };
    featureCards?: FeatureCard[];
}

export interface ThemeBreakpoints {
    mobile: string;
    tablet: string;
    desktop: string;
}

export interface ThemeSpacing {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
}

export interface Theme {
    breakpoints: ThemeBreakpoints;
    spacing: ThemeSpacing;
    responsiveContainer: object;
    responsiveTitle: object;
    responsiveText: object;
    formContainer: object;
    mobileFormField: object;
    mobileFormLabel: object;
}
