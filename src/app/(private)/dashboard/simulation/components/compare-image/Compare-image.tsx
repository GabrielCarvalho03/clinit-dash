import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeftRight,
  Sparkles,
  Maximize2,
  MousePointer2,
  Edit3,
  Eraser,
  Download,
} from "lucide-react";

interface ImageCompareProps {
  imagemAntes: string;
  imagemDepois: string;
  tipo: "sorriso" | "harmonizacao";
  configuracoes: any;
  isDrawingMode?: boolean;
  onDrawingModeChange?: (isDrawing: boolean) => void;
}

interface DrawingPoint {
  x: number;
  y: number;
  color: string;
  isNewStroke: boolean;
  canvas: "antes" | "depois";
}

export const ImageCompare = ({
  imagemAntes,
  imagemDepois,
  tipo,
  configuracoes,
  isDrawingMode = false,
  onDrawingModeChange,
}: ImageCompareProps) => {
  const [isComparing, setIsComparing] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawings, setDrawings] = useState<DrawingPoint[]>([]);
  const [fullscreenSliderPosition, setFullscreenSliderPosition] = useState(50);
  const [fullscreenComparing, setFullscreenComparing] = useState(true);
  const canvasRefAntes = useRef<HTMLCanvasElement>(null);
  const canvasRefDepois = useRef<HTMLCanvasElement>(null);
  const fullscreenCanvasAntes = useRef<HTMLCanvasElement>(null);
  const fullscreenCanvasDepois = useRef<HTMLCanvasElement>(null);

  const handleDrawingStart = (
    event: React.MouseEvent<HTMLCanvasElement>,
    canvas: "antes" | "depois"
  ) => {
    if (!isDrawingMode) return;

    setIsDrawing(true);
    const canvasElement = event.currentTarget;
    if (!canvasElement) return;

    const rect = canvasElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvasElement.width / rect.width);
    const y = (event.clientY - rect.top) * (canvasElement.height / rect.height);

    const color = event.button === 2 ? "#ef4444" : "#3b82f6";

    setDrawings((prev) => [
      ...prev,
      { x, y, color, isNewStroke: true, canvas },
    ]);
  };

  const handleDrawingMove = (
    event: React.MouseEvent<HTMLCanvasElement>,
    canvas: "antes" | "depois"
  ) => {
    if (!isDrawingMode || !isDrawing) return;

    const canvasElement = event.currentTarget;
    if (!canvasElement) return;

    const rect = canvasElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvasElement.width / rect.width);
    const y = (event.clientY - rect.top) * (canvasElement.height / rect.height);

    const color = event.buttons === 2 ? "#ef4444" : "#3b82f6";

    setDrawings((prev) => [
      ...prev,
      { x, y, color, isNewStroke: false, canvas },
    ]);
  };

  const handleDrawingEnd = () => {
    setIsDrawing(false);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    if (isDrawingMode) {
      event.preventDefault();
    }
  };

  const clearDrawings = () => {
    setDrawings([]);
  };

  const handleDownload = () => {
    // Download da imagem depois (resultado da simulação)
    fetch(imagemDepois)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `simulacao-resultado-${Date.now()}.png`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Erro ao baixar imagem:", error);
        // Fallback: tentar download direto
        const link = document.createElement("a");
        link.href = imagemDepois;
        link.download = `simulacao-resultado-${Date.now()}.png`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  const handleToggleDrawingMode = () => {
    const newDrawingMode = !isDrawingMode;
    if (newDrawingMode && isComparing) {
      setIsComparing(false);
    }
    onDrawingModeChange?.(newDrawingMode);
  };

  const drawOnCanvas = (
    canvas: HTMLCanvasElement,
    canvasType: "antes" | "depois"
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasDrawings = drawings.filter((d) => d.canvas === canvasType);

    if (canvasDrawings.length > 0) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 3;

      let currentPath: DrawingPoint[] = [];

      for (let i = 0; i < canvasDrawings.length; i++) {
        const point = canvasDrawings[i];

        if (point.isNewStroke) {
          if (currentPath.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = currentPath[0].color;
            ctx.moveTo(currentPath[0].x, currentPath[0].y);
            for (let j = 1; j < currentPath.length; j++) {
              ctx.lineTo(currentPath[j].x, currentPath[j].y);
            }
            ctx.stroke();
          }
          currentPath = [point];
        } else {
          currentPath.push(point);
        }
      }

      if (currentPath.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = currentPath[0].color;
        ctx.moveTo(currentPath[0].x, currentPath[0].y);
        for (let j = 1; j < currentPath.length; j++) {
          ctx.lineTo(currentPath[j].x, currentPath[j].y);
        }
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    [
      { canvas: canvasRefAntes.current, type: "antes" as const },
      { canvas: canvasRefDepois.current, type: "depois" as const },
      { canvas: fullscreenCanvasAntes.current, type: "antes" as const },
      { canvas: fullscreenCanvasDepois.current, type: "depois" as const },
    ].forEach(({ canvas, type }) => {
      if (canvas) {
        drawOnCanvas(canvas, type);
      }
    });
  }, [drawings]);

  const FullScreenCompareView = () => (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <div
        className="relative w-full max-w-6xl h-full max-h-[85vh] overflow-hidden flex items-center justify-center"
        style={{ touchAction: "none" }}
      >
        <div className="relative w-full h-full">
          <img
            src={imagemDepois}
            alt="Antes"
            className="absolute inset-0 w-full h-full object-contain"
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: `inset(0 ${100 - fullscreenSliderPosition}% 0 0)`,
            }}
          >
            <img
              src={imagemAntes}
              alt="Depois"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize flex items-center"
            style={{ left: `${fullscreenSliderPosition}%` }}
          >
            <div className="w-8 h-8 bg-white rounded-full shadow-lg -ml-4 flex items-center justify-center">
              <ArrowLeftRight className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={fullscreenSliderPosition}
          onChange={(e) => setFullscreenSliderPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-20"
          style={{ touchAction: "none" }}
        />

        <div className="absolute top-4 left-4 z-40">
          <Badge variant="secondary" className="bg-black/70 text-white">
            Antes
          </Badge>
        </div>
        <div className="absolute top-4 right-4 z-40">
          <Badge className="bg-primary">
            <Sparkles className="mr-1 h-3 w-3" />
            Depois
          </Badge>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
          <div className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
            {fullscreenSliderPosition.toFixed(0)}% revelado
          </div>
        </div>
      </div>
    </div>
  );

  // const FullScreenSeparateView = () => (
  //   <div className="relative w-full h-full bg-black">
  //     <div className="flex h-full items-center justify-center gap-4 p-4">
  //       <div className="flex-1 relative h-full flex items-center justify-center">
  //         <img
  //           src={imagemAntes}
  //           alt="Antes"
  //           className="max-w-full max-h-full object-contain"
  //         />
  //         <Badge
  //           variant="secondary"
  //           className="absolute top-4 left-4 bg-black/70 text-white"
  //         >
  //           Antes
  //         </Badge>

  //         {isDrawingMode && (
  //           <canvas
  //             ref={fullscreenCanvasAntes}
  //             width={800}
  //             height={600}
  //             className="absolute inset-0 cursor-crosshair"
  //             style={{
  //               width: "100%",
  //               height: "100%",
  //               objectFit: "contain",
  //             }}
  //             onMouseDown={(e) => handleDrawingStart(e, "antes")}
  //             onMouseMove={(e) => handleDrawingMove(e, "antes")}
  //             onMouseUp={handleDrawingEnd}
  //             onMouseLeave={handleDrawingEnd}
  //             onContextMenu={handleContextMenu}
  //           />
  //         )}
  //       </div>
  //       <div className="flex-1 relative h-full flex items-center justify-center">
  //         <img
  //           src={imagemDepois}
  //           alt="Depois"
  //           className="max-w-full max-h-full object-contain"
  //         />
  //         <Badge className="absolute top-4 right-4 bg-primary">
  //           <Sparkles className="mr-1 h-3 w-3" />
  //           Depois
  //         </Badge>

  //         {isDrawingMode && (
  //           <canvas
  //             ref={fullscreenCanvasDepois}
  //             width={800}
  //             height={600}
  //             className="absolute inset-0 cursor-crosshair"
  //             style={{
  //               width: "100%",
  //               height: "100%",
  //               objectFit: "contain",
  //             }}
  //             onMouseDown={(e) => handleDrawingStart(e, "depois")}
  //             onMouseMove={(e) => handleDrawingMove(e, "depois")}
  //             onMouseUp={handleDrawingEnd}
  //             onMouseLeave={handleDrawingEnd}
  //             onContextMenu={handleContextMenu}
  //           />
  //         )}
  //       </div>
  //     </div>

  //     {isDrawingMode && (
  //       <div className="absolute bottom-4 left-4 flex gap-2">
  //         <div className="flex items-center gap-2 bg-black/70 px-3 py-2 rounded-lg text-white text-sm">
  //           <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
  //           <span>Botão Esquerdo</span>
  //         </div>
  //         <div className="flex items-center gap-2 bg-black/70 px-3 py-2 rounded-lg text-white text-sm">
  //           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
  //           <span>Botão Direito</span>
  //         </div>
  //         <Button
  //           variant="outline"
  //           size="sm"
  //           onClick={clearDrawings}
  //           className="bg-black/70 text-white border-white/20"
  //         >
  //           <Eraser className="mr-1 h-3 w-3" />
  //           Limpar
  //         </Button>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Comparação Antes & Depois
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={isComparing ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsComparing(true);
                  if (isDrawingMode) {
                    onDrawingModeChange?.(false);
                  }
                }}
              >
                Modo Comparação
              </Button>
              <Button
                variant={!isComparing ? "default" : "outline"}
                size="sm"
                onClick={() => setIsComparing(false)}
              >
                Ver Lado a Lado
              </Button>

              {!isComparing && (
                <div className="flex gap-1">
                  <Button
                    variant={isDrawingMode ? "default" : "outline"}
                    size="sm"
                    onClick={handleToggleDrawingMode}
                  >
                    <Edit3 className="mr-1 h-3 w-3" />
                    {isDrawingMode ? "Parar Marcações" : "Fazer Marcações"}
                  </Button>
                  {isDrawingMode && (
                    <Button variant="outline" size="sm" onClick={clearDrawings}>
                      <Eraser className="mr-1 h-3 w-3" />
                      Limpar
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isComparing ? (
            <div className="relative">
              <div
                className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg border"
                style={{
                  aspectRatio: "16/10",
                  touchAction: "none",
                }}
              >
                <img
                  src={imagemDepois}
                  alt="Depois"
                  className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                />

                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                  }}
                >
                  <img
                    src={imagemAntes}
                    alt="Antes"
                    className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                  />
                </div>

                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize flex items-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-6 h-6 bg-white rounded-full shadow-lg -ml-3 flex items-center justify-center">
                    <ArrowLeftRight className="h-3 w-3 text-gray-600" />
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-20"
                  style={{ touchAction: "none" }}
                />

                <div className="absolute top-4 left-4 z-40">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    Antes
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-40">
                  <Badge className="bg-primary">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Depois
                  </Badge>
                </div>

                <Dialog>
                  <DialogContent className="max-w-screen-xl h-[95vh] p-0">
                    <DialogTitle className="sr-only">
                      Comparação em tela cheia
                    </DialogTitle>
                    <FullScreenCompareView />
                  </DialogContent>
                </Dialog>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-2">
                Arraste para comparar • {sliderPosition.toFixed(0)}% revelado
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="relative group">
                  <div
                    className="relative w-full rounded-lg border bg-gray-50 overflow-hidden"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <img
                      src={imagemAntes}
                      alt="Antes"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 bg-black/70 text-white"
                    >
                      Antes
                    </Badge>

                    {isDrawingMode && (
                      <canvas
                        ref={canvasRefAntes}
                        width={400}
                        height={300}
                        className="absolute inset-0 w-full h-full cursor-crosshair"
                        onMouseDown={(e) => handleDrawingStart(e, "antes")}
                        onMouseMove={(e) => handleDrawingMove(e, "antes")}
                        onMouseUp={handleDrawingEnd}
                        onMouseLeave={handleDrawingEnd}
                        onContextMenu={handleContextMenu}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <div
                    className="relative w-full rounded-lg border bg-gray-50 overflow-hidden"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <img
                      src={imagemDepois}
                      alt="Depois"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <Badge className="absolute top-2 left-2 bg-primary">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Depois
                    </Badge>

                    {isDrawingMode && (
                      <canvas
                        ref={canvasRefDepois}
                        width={400}
                        height={300}
                        className="absolute inset-0 w-full h-full cursor-crosshair"
                        onMouseDown={(e) => handleDrawingStart(e, "depois")}
                        onMouseMove={(e) => handleDrawingMove(e, "depois")}
                        onMouseUp={handleDrawingEnd}
                        onMouseLeave={handleDrawingEnd}
                        onContextMenu={handleContextMenu}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-full flex justify-center">
                <Dialog>
                  <DialogTrigger asChild></DialogTrigger>
                  <DialogContent className="max-w-screen-xl h-[95vh] p-0">
                    <DialogTitle className="sr-only">
                      Visualização em tela cheia
                    </DialogTitle>
                    <div className="relative w-full h-full bg-black">
                      <div className="absolute top-4 left-4 z-50 flex gap-2">
                        <Button
                          variant={fullscreenComparing ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFullscreenComparing(true)}
                          className="bg-black/70 text-white border-white/20"
                        >
                          Modo Comparação
                        </Button>
                        <Button
                          variant={!fullscreenComparing ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFullscreenComparing(false)}
                          className="bg-black/70 text-white border-white/20"
                        >
                          Ver Lado a Lado
                        </Button>

                        {!fullscreenComparing && (
                          <Button
                            variant={isDrawingMode ? "default" : "outline"}
                            size="sm"
                            onClick={handleToggleDrawingMode}
                            className="bg-black/70 text-white border-white/20"
                          >
                            <Edit3 className="mr-1 h-3 w-3" />
                            {isDrawingMode
                              ? "Parar Marcações"
                              : "Fazer Marcações"}
                          </Button>
                        )}
                      </div>

                      {/* {fullscreenComparing ? (
                        <FullScreenCompareView />
                      ) : (
                        <FullScreenSeparateView />
                      )} */}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          {isDrawingMode && !isComparing && (
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MousePointer2 className="h-4 w-4" />
                <span>Clique e arraste para desenhar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Botão esquerdo (azul)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Botão direito (vermelho)</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
