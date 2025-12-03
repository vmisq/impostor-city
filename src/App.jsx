
import Header from "./components/Header";
import Game from "./components/Game";

export default function App() {
  return (
    <div class="flex flex-col h-screen overflow-auto">
      <Header />
      <div class="flex-1 max-w-xl h-full flex flex-col gap-4 mx-auto text-base-content p-8">
        <article  class="text-center prose dark:prose-invert">
          <h1>Cidade Impostora!</h1>
          <p>Identifique a cidade que não faz parte do grupo para acumular pontos!<br></br>Quanto mais rápido responder, maior será seu bônus!</p>
        </article>
        <Game />
      </div>
    </div>
  );
}
