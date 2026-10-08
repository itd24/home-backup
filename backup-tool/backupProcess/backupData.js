// make backup with docker exec to "file backup / tmp"
// check file sizes with sizes in metadata (updating temporary metadata in the process)
// if anything off (size is less than 90% of the original filesize, count of documents is less than 90% of the previous count), write telegram message
// if everything went through, delete files in backup and replace them with the files in tmp
