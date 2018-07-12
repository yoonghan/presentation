
cd C:\selfservice\prototype\moviemaker\utility\execute

..\phantomjs\bin\phantomjs.exe runmovie.js c:/tmp/movie

cd C:\selfservice\prototype\moviemaker\utility\ffmpeg\bin

ffmpeg -framerate 30 -i c:/tmp/frame_%05d.png -c:v libx264 -vf fps=30 -pix_fmt yuv420p out.mp4

ffmpeg -i out.mp4 -i out.mp3 -c copy -map 0:0 -map 1:0 final.mp4
