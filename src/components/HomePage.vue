<script setup>


</script>
<template>
  <div class="HomeContainer">
    <div class="NotesTab">
      <div class="title">
        <h4>Notes</h4>
        <button class="newNote" @click="newNote()"><font-awesome-icon icon="fa-solid fa-pen-to-square"  class="icon"/></button>
      </div>
      <div class="Notes" id="Notes">
        <div class="Notes1">
        <p class="NoteTitle">
          Class Notes Apr 17
        </p>
        <p class="NoteDescr">
          Lorem ipsum dolor sit amet sed od...
        </p>
      </div>
      </div>
  </div>
  <div class="MarkdownSection">
    <div class="NoteContent">
      Lorem ipsum dolor sit amet, sed odio partem constituto ex, an per delicata scribentur, doctus tamquam has an. Vis erant invenire eu, cu mel mucius imperdiet. An vero intellegat his, an mel munere delenit repudiandae, cum no dicit legendos sententiae. Ne sit congue consequuntur concludaturque, an fastidii cotidieque dissentiet mel. Ubique option sanctus te vix.

      Sea id liber eripuit suscipiantur, atqui iusto appellantur ex sed. At nec augue explicari. Eos et omnium accommodare, odio scripta maiestatis ei sed, ut mutat verterem argumentum sit. Eu his nibh soleat nonumes, modo facilis legendos vel at. Timeam denique lobortis ex his, iusto rationibus eos te.

      Eu dolorum antiopam conceptam pro. Et tation copiosae iracundia ius. Est odio dicit rationibus te. Duo in verear maluisset urbanitas, et justo accusam pro. Quo aperiam impedit urbanitas te, ne affert veniam putant quo. Ad mea omnes facilisi recteque, quot tibique epicurei est te.

    </div>
    <div class="buttons">
      <button>Edit</button>
      <button>Share</button>
    </div>
  </div>
  </div>
</template>

<style>
 .notes{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.HomeContainer{
  display: flex;
  height: 95vh;
  width: 100%;
}
.MarkdownSection{
  width: 100%;
}
.NotesTab{
  width: 42%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1.5px solid rgb(201, 201, 201);
}
.NotesTab .title{
  display: flex;
  justify-content: space-between;
  padding-bottom: 13px;
  padding-top: 13px;
  padding-left: 30px;
  padding-right: 30px;
  width: 100%;
  border-bottom: 1.5px solid rgb(201, 201, 201);
}
.NotesTab button{
  background: none;
  border: none;
  border-radius: none;
  cursor: pointer;
  font-size: 18px;
}
.NotesTab .Notes{
  width: 100%;
}
.NotesTab .Notes1{
  text-align: left;
  padding: 22px;
  background-color: #e5d0f5;
  width: 100%;
  height: 82px;
  cursor: pointer;
  border-bottom: 1.5px solid rgb(201, 201, 201);
}
.Notes p{
  padding-bottom: 5px;
}
.MarkdownSection{
  padding: 48px;
  height: 100%;
}
.buttons{
  position: absolute;
  bottom: 10%;
  right: 9%;
}
.buttons button{
  margin-left: 40px;
  height: 39px;
  width: 68px;
  border: none;
  border-radius: 5px;
  background-color: #322467;
  color: #FFFF;
  cursor: pointer;
}

</style>
