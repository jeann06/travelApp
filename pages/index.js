import { useSession } from "next-auth/react";
import { useState } from "react";

const HomePage = () => {
  const { data: session, status } = useSession();
  if (status == "authenticated") {
    console.log(session);
  }
  return (
    <div>
      <img
        className="mb-4"
        alt=""
        width={1519}
        height={703}
        src="https://pik2.com/storage/images/sliders/thumb-1080-f954c10e611c5db66ea9bc951e84fe33.jpg"
      />
    </div>
  );
};

export default HomePage;
