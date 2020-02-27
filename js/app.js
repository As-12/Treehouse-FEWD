


/* Enable lightgallery plugin */
let $gallery = $('#lightgallery')[0]; // Get HTML DOM instead of JQuery object
lightGallery($gallery);


/* Loop through element of each list item of specific class
        If the attribute does not contain the string in text, then add hide class.
        Delayed setting position to fixed for smooth flex flow transitions.
*/

function filterList(listId, text) {
    const listItems = $(listId + " li");
    listItems.each(function(index , item){
        
        const str = $(item).attr('data-sub-html');
        if (str.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
            $(item).css('position','relative');
            $(item).removeClass('hide');
        } 
        else {
            $(item).addClass('hide'); 
            setTimeout( function() { $(item).css('position','fixed');} , 500);
        }
        
    });
}

$("#search-text").keyup(function () {
   
    const searchTerm = $("#search-text").val();
    const mylist = "#lightgallery";

    filterList(mylist, searchTerm);

 });


