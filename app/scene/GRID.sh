#SET YOUR TEMP DIRECTORY
TMP='./tmp/'
if [ ! -d "$TMP" ]; then mkdir TMP; fi

#SET YOUR ARGS
if [ -z "$1" ]; then echo "you need to give the file path" ; exit ; fi
if [ -z "$2" ]; then echo "you need to give the number of cut" ; exit ; fi

#SET GRID X*Y
X=$2
Y=$X
if [ ! -z "$3" ] ; then Y=$3 ; fi

#SET THE SIZE 
WIDTH=$(($(sudo identify -format '%w' $1)/$X))
HEIGHT=$(($(sudo identify -format '%h' $1)/$Y))

#DISPLAY

echo "GRID ${X}x${Y} IMAGES $(($X*$Y))"

CMP=0
x=$(($X-1))
y=$(($Y-1))
       
for i in $(seq 0 $x); do
    for j in $(seq 0 $y); do
           NAME=$TMP'/'$i'_'$j'.jpg'

           #POSITION
           cX=$((WIDTH*i))
           cY=$((HEIGHT*j))

           convert -crop "${WIDTH}x${HEIGHT}+${cX}+${cY}" $1 $NAME
           CMP=$(($CMP+1));
           printf  '.'
           if [ $(($CMP%$X)) = 0 ] ; then  printf '\n'; fi
    done
done

echo "done"