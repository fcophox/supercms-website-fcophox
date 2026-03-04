"use client";

import Image from "next/image";

export default function AboutLogoHover() {
    return (
        <div className="flex justify-center items-center py-24">
            <div className="grid aspect-square w-64 sm:w-80 group [perspective:300em]">
                {/* Capa 1 (Más arriba) */}
                <div className="col-start-1 row-start-1 w-64 h-64 [transform-style:preserve-3d] transition-transform duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:!transform-none [transform:rotateX(60deg)_rotateZ(45deg)_translateZ(6rem)] z-40 relative">
                    <Image src="/brand/logotipo/4.svg" alt="Logo Layer 4" fill priority className="object-contain drop-shadow-xl" />
                </div>

                {/* Capa 2 */}
                <div className="col-start-1 row-start-1 w-64 h-64 [transform-style:preserve-3d] transition-transform duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:!transform-none [transform:rotateX(60deg)_rotateZ(45deg)_translateZ(2rem)] z-30 relative">
                    <Image src="/brand/logotipo/3.svg" alt="Logo Layer 3" fill priority className="object-contain drop-shadow-lg" />
                </div>

                {/* Capa 3 */}
                <div className="col-start-1 row-start-1 w-64 h-64 [transform-style:preserve-3d] transition-transform duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:!transform-none [transform:rotateX(60deg)_rotateZ(45deg)_translateZ(-2rem)] z-20 relative">
                    <Image src="/brand/logotipo/2.svg" alt="Logo Layer 2" fill priority className="object-contain drop-shadow-md" />
                </div>

                {/* Capa 4 (Más abajo) */}
                <div className="col-start-1 row-start-1 w-64 h-64 [transform-style:preserve-3d] transition-transform duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:!transform-none [transform:rotateX(60deg)_rotateZ(45deg)_translateZ(-6rem)] z-10 relative">
                    <Image src="/brand/logotipo/1.svg" alt="Logo Layer 1" fill priority className="object-contain drop-shadow-sm" />
                </div>
            </div>
        </div>
    );
}
