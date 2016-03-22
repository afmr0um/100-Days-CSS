<?php 
if($_POST)
{ 
    //check if its an ajax request, exit if not
    if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
        die('Request must come from Ajax.');
    } 
    
    //check $_POST vars are set, exit if any missing
    if(!isset($_POST["userEmail"]))
    {
        die();    
    }

    //Sanitize input data using PHP filter_var().
    $userEmail       = filter_var($_POST["userEmail"], FILTER_SANITIZE_EMAIL);
    
    //TextDatei
    $datei = fopen("../../list.txt","a");
    
    fwrite ( $datei, $userEmail );
    fwrite ( $datei, "\n" );
        
    fclose($datei);
}
?>

