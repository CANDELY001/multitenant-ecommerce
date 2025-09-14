import { cookies as getCookies } from "next/headers";

interface Props {
  prefix: string;
  value: string;
}

export const generateAuthCookie = async ({ prefix, value }: Props) => {
  console.log("Setting auth cookie:", { prefix, hasToken: !!value });

  const cookies = await getCookies();
  const cookieName = `${prefix}-token`;

  // Different settings for development vs production
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    path: "/",
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    domain: isProduction ? process.env.NEXT_PUBLIC_ROOT_DOMAIN : undefined,
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };

  //console.log("Cookie options:", { cookieName, cookieOptions });

  cookies.set(cookieName, value, cookieOptions);

  // Verify cookie was set
  //const verifySet = cookies.get(cookieName);
  // console.log("Cookie set verification:", {
  //   cookieName,
  //   wasSet: !!verifySet?.value,
  // });
};
