<?php
$action = $_POST['action'];
$data = array();
$uploaddir = './images/pic/';



/**
 * Function to shorten query based on data
 *
 * @param      <type>  $query  The sql query
 * @param      string  $type   The type query, Only define if it is, a type select, for another type not to add parameter
 *
 * @return     array   ( Data base information in case of query type select  )
 */
function query($query, $type=''){
    // Connection based on data and definition of base name

    $link = mysqli_connect ('localhost' , 'root' , 'root', 'testlistingphoto');

    // If the query is of type select
    if($type === 'select'){
        // Make records query
        $result = mysqli_query ( $link , $query) or die('Consulta fallida: ' . mysqli_error());
        $returnQuery  = array();

        while($line = mysqli_fetch_array($result, MYSQL_ASSOC)){
            $returnQuery[] = $line;
        }
        // Release result information
        mysqli_free_result($result);
    }else{
        // Make another type of registration query
        $result = mysqli_query ( $link , $query) or die('Consulta fallida: ' . mysqli_error());
    }

    // Close connection to data base
    mysqli_close($link);

    // If the query is of type select, return array of information of the registers
    if($type === 'select'){
        return $returnQuery;
    }
}

// If the action is to `add`, make temporary file move from file to folder and rename it and register in base the new item
if($action === 'add'){
    $error = false;
    foreach($_FILES as $file){
        if(move_uploaded_file($file['tmp_name'], $uploaddir .basename($file['name']))){
            $files = $uploaddir .$file['name'];
            query("INSERT INTO photo (route,description,sequence) VALUES ('".$uploaddir . basename($file['name'])."','".$_POST["description"]."','".$_POST["order"]."')");
        }else{
            $error = true;
        }
    }
    $data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files, 'description' => $_POST["description"], 'order' => $_POST["order"]);
// If the action is content editing, check what information is changed and record the changes in the base. If the image is new upload the image to the folder.
}else if($action === 'edit'){
    $error = false;
    if(count($_FILES)>0){
	    $dirHandle = opendir($uploaddir);
	    $imgexist = false;
        foreach($_FILES as $file){
            $dataNameImg = $file['name'];
            while ($file1 = readdir($dirHandle)) {

                if($file1==$dataNameImg) {
                    $imgexist = true;
                }
            }
            if(!$imgexist){
                if(move_uploaded_file($file['tmp_name'], $uploaddir . basename($file['name']))){
                    $files = basename($file['name']);
                    query("UPDATE `photo` SET route='" . $uploaddir . basename($file['name']) . "',description='" . $_POST["description"] . "' WHERE id=".$_POST['id']);
                }else{
                    $error = true;
                }
                $data = ($error) ? array('error' => '1There was an error uploading your files') : array('files' => $files, 'description' => $_POST["description"]);
            }else{
                query("UPDATE `photo` SET route='" . $uploaddir . basename($file['name']) . "',description='" . $_POST["description"] . "' WHERE id=".$_POST['id']);
                $data = ($error) ? array('error' => '2There was an error uploading your files') : array('files' => $uploaddir . basename($file['name']), 'description' => $_POST["description"]);
            }
        }
        closedir($dirHandle);
    }else{
        query("UPDATE `photo` SET route='" . $_POST["file"] . "',description='" . $_POST["description"] . "' WHERE id=".$_POST['id']);
        $data = ($error) ? array('error' => '3There was an error uploading your files') : array('files' => $uploaddir.$_POST["file"], 'description' => $_POST["description"]);
    }
// If the action is to `remove` the item. Delete folder from file and delete record from database
}else if($action === 'remove'){
    $queryresult = query("DELETE FROM `photo` WHERE id=".$_POST['id']);
    $dataNameImg = $_POST['nameImg'];

    $dirHandle = opendir($uploaddir);
    while ($file = readdir($dirHandle)) {
        if($file==$dataNameImg) {
            unlink($uploaddir.'/'.$file);
        }
    }
    closedir($dirHandle);
// If the action is refresh, make query of the records of the data base and send array of information of each record
}else if($action === 'refresh'){
    $queryresult = query("SELECT * FROM `photo`", 'select');
    //print_r($queryresult);
    foreach ($queryresult as $value) {
        $data[] = ['order' => $value['sequence'], 'order' => $value['sequence'], 'description' => $value['description'], 'route' => $value['route'], 'id' => $value['id']];
    }
// If the action is to reorder, record the change of order in the data base.
}else if($action === 'reorder'){
    for ($i=0; $i < count($_POST['id']); $i++) {
        query("UPDATE `photo` SET sequence='" . $_POST["order"][$i] . "' WHERE id=".$_POST['id'][$i]);
    }
}

// Convert array of information in json format
echo json_encode($data);
?>