echo off
mkdir rimrafdir
mkdir rimrafdir\dir1
mkdir rimrafdir\dir2
mkdir rimrafdir\dir3
mkdir rimrafdir\dir4
mkdir rimrafdir\dir1\dir1-1
mkdir rimrafdir\dir1\dir1-2
mkdir rimrafdir\dir1\dir1-3
mkdir rimrafdir\dir2\dir2-1

echo '' > rimrafdir\file1
echo '' > rimrafdir\dir1\file1
echo '' > rimrafdir\dir1\file2
echo '' > rimrafdir\dir1\file3
echo '' > rimrafdir\dir1\file4
echo '' > rimrafdir\dir4\file1
echo '' > rimrafdir\dir4\file2
echo '' > rimrafdir\dir4\file3
echo '' > rimrafdir\dir1\dir1-1\file1
echo '' > rimrafdir\dir1\dir1-1\file2
echo '' > rimrafdir\dir1\dir1-1\file3
echo '' > rimrafdir\dir1\dir1-3\file1
echo '' > rimrafdir\dir2\dir2-1\file1
echo '' > rimrafdir\dir2\dir2-1\file2
echo '' > rimrafdir\dir2\dir2-1\file3
echo on