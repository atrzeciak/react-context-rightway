import { type JSX, useState } from "react";

import { Counter } from "@/counter/Counter";
import { DataPage } from "@/pages/DataPage";
import { useStoreActions, useStoreTheme } from "@/store/StoreContextProvider";
import { ToggleThemeButton } from "@/theme/ToggleThemeButton";
import { Button } from "@/ui/Button";
import { Footer } from "@/ui/Footer";
import { Header } from "@/ui/Header";
import { Main } from "@/ui/Main";
import { Paragraph } from "@/ui/Paragraph";

const currentYear = new Date().getFullYear();

export const Page = (): JSX.Element => {
  const [counter, setCounter] = useState(0);

  const incrementCounter = (): void => {
    setCounter((c) => c + 1);
  };
  const theme = useStoreTheme();
  const { toggleTheme } = useStoreActions();

  return (
    <>
      <Header>
        <Paragraph>React Context - The Right Way</Paragraph>
        <Button onClick={incrementCounter}>Click me</Button>
        <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
      </Header>
      <Main>
        <DataPage />
      </Main>
      <Footer>
        <Paragraph>© {currentYear}</Paragraph>
        <Counter count={counter} />
      </Footer>
    </>
  );
};
