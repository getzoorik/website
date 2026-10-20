/**
 * Each film's size in bytes, by its path. A range answer needs the file's full
 * size (`Content-Range: bytes 0-1/2675775`), and the response the Worker gets
 * from the static assets carries no Content-Length (measured in the Worker). A
 * test holds this to the files in `public/motion`; a new cut gets a new file
 * name, and a line here.
 */
export const motionSizes: Readonly<Record<string, number>> = {
  "/motion/amoeba-overview-5s.mp4": 2229499,
  "/motion/coral-overview-5s.mp4": 2675775,
};
