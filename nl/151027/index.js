'use strict';

class Builder{

  constructor (){
    this.starsByDate = {};

    this.data = JSON.parse(document.querySelector('#data').textContent);
    this.starsData = this.data.items.reverse();

    this.wall = document.querySelector('.wall');

    this.postGroupTemplate = document.querySelector('#post-group-template').content;
    this.postTemplate = document.querySelector('#post-template').content;
  }

  process (){

    this._getStarsByDate();
    this._processPosts();

    console.log('>', this.starsByDate);

  }

  _getStarsByDate () {

    this.starsData.forEach( (star) => {

      if(!star.message){
        return;
      }

      let date = new Date(parseInt(star.message.ts.substr(0,star.message.ts.indexOf('.')))* 1000),
          month = ["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"][date.getMonth()],
          day = date.getDate(),
          dateIndex = month+'-'+day;

      if(this.starsByDate[dateIndex]){
        this.starsByDate[dateIndex].push(star);
      }else{
        this.starsByDate[dateIndex] = [star];
      }

    });

  }

  _processPosts () {

    Object.keys(this.starsByDate).forEach( (date) => {
      var avatar, messageLinks,
          month = date.split('-')[0],
          day = date.split('-')[1];

      this.postGroupTemplate.querySelector('.posts').innerHTML = '';
      this.postGroupTemplate.querySelector('.month').innerHTML = month;
      this.postGroupTemplate.querySelector('.day').innerHTML = day;

      this.starsByDate[date].forEach((star)=>{
        let href, pipe, user,
            date = new Date(parseInt(star.message.ts.substr(0,star.message.ts.indexOf('.')))* 1000),
            hours = date.getHours(),
            time = hours + ':' + date.getMinutes() + (hours >= 12 ? ' PM' : ' AM');

        this.postTemplate.querySelector('.links').innerHTML = '';

        this.postTemplate.querySelector('.permalink').href = star.message.permalink;

        this.postTemplate.querySelector('.month').innerHTML = month;
        this.postTemplate.querySelector('.day').innerHTML = day;
        this.postTemplate.querySelector('.time').innerHTML = time;

        this.postTemplate.querySelector('.content img').style.display = '';
        if(star.message.img){
          this.postTemplate.querySelector('.content img').src = 'img/'+star.message.img;
        }else{
          this.postTemplate.querySelector('.content img').style.display = 'none';
        }

        this.postTemplate.querySelector('.content p').style.display = '';

        if(star.message.copy){
          this.postTemplate.querySelector('.content p').innerHTML = star.message.copy;
        }else{
          this.postTemplate.querySelector('.content p').style.display = 'none';
        }



        this.postTemplate.querySelector('.username').innerHTML = star.message.user.name;

        Object.keys(star.message.user.profile).forEach(function(profileKey){
          if(profileKey.indexOf('image_')>-1){
            avatar = star.message.user.profile[profileKey];
          }
        });

        this.postTemplate.querySelector('.avatar').style.backgroundImage = 'url('+avatar+')';

        messageLinks = star.message.text.match(/\<([^>]+)\>/);

        if(messageLinks){
          messageLinks.forEach((link)=>{

            if(typeof link !== 'string'){
              return;
            }

            //links
            if(link.indexOf('.') > -1 && link.indexOf('<') < 0){
              href = decodeURIComponent(messageLinks[1]);

              if(href.indexOf('|')>-1){
                href = href.substr(0,href.indexOf('|'));
              }

              star.message.text = star.message.text.replace(messageLinks[0], '<a href="'+href+'">'+href+'</a>');

              if(!star.message.attachments){
                star.message.attachments = [{
                  title: href,
                  from_url: href
                }]
              }
            }

            //mentions
            if(link.indexOf('@') > -1 && link.indexOf('<') > -1){

              if(link.indexOf('|') > -1){
                user = link.substr(link.indexOf('@')+1, link.indexOf('|')-2);
              }else{
                user = link.substr(link.indexOf('@')+1, link.length-3);
              }

              user = this.data.users[user];

              if(user){
                star.message.text = star.message.text.replace(link, '<a href="https://gdljs.slack.com/team/'+user.name+'">'+user.name+'</a>');
              }

            }

          });
        }



        this.postTemplate.querySelector('.message').innerHTML = star.message.text;





        if(star.message.attachments){
          star.message.attachments.forEach((attachment) => {
            let anchor = document.createElement('a'),
                title = attachment.title ? attachment.title : attachment.from_url;

            anchor.href = attachment.from_url;
            anchor.title = title
            anchor.appendChild(document.createTextNode(title));
            this.postTemplate.querySelector('.links').appendChild(anchor);
          });
        }




        this.postGroupTemplate.querySelector('.posts').appendChild(document.importNode(this.postTemplate, true));
      });

      this.wall.appendChild(document.importNode(this.postGroupTemplate, true));
    });


  }

};
