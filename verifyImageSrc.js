angular.module('app')
	.directive('verifyImageSrc',['$timeout', '$compile', 'utilitiesService', function($timeout, $compile, utilitiesService) {
		var directive = {
			  restrict: 'A'
			, link: function(scope, element, attrs) {
				/**
				 * This will get the image from the attribute and verify if the image exist
				 * onload, onerror
				 *
				 * If the image onload, it will place the image within the dom of the
				 * parent container, add new class to element 'ng-valid'
				 *
				 * onerror, add class to element 'ng-invalid'
				 *
				 * Acceptable attributes
				 * 		data-true, place the image within the css of the parent element
				 *
				 * 	default 'NONE', inject new $childNode
				 *
				 * @type {Image}
				 */

				var image = new Image();
				var  icon = false
					,imageSource = attrs.verifyImageSrc;

				//create a source element, only to be use during video integration
				var source = angular.element( '<source>' );
				//load the image src to the image object
				image.src = imageSource;

				//load source to video source object, only to be used during video integration
				source[0].src =  imageSource


				//watch for changes due to js timing on dom load
				var getImageSrc = scope.$watch
				( function(){
					  return attrs.verifyImageSrc;
				  }
					, function( imageSource ){
					  //continue watchin
					  if( ! imageSource){
						  return;
					  }

					  imageSource = imageSource;
					  image.src = imageSource;

					  //incase of changes
					  source[0].src =  imageSource

					  // Remove watch now that we have what we need.
					  getImageSrc();
				  }
				);

				for(var i in scope.menuItems){
					if(scope.menuItems[i].selected){
						icon = scope.menuItems[i].icon
					}
				}


				/**
				 * Allow for implementation of HTML5 Video,
				 * The supported image format for web, example http://v4e.thewikies.com/
				 * Example on control hooks
				 * http://blog.teamtreehouse.com/building-custom-controls-for-html5-videos
				 *
				 * Note: http://diveintohtml5.info/detect.html#video
				 * "probably" if the browser is fairly confident it can play this format
				 * "maybe" if the browser thinks it might be able to play this format
				 * "" (an empty string) if the browser is certain it can’t play this format
				 *
				 * Chrome  - webm, ogg, ogv, mp4
				 * Firefox - webm, ogg, ogv
				 * Safari  - mp4
				 * IE	   - mp4
				 * Opera   - webm, ogg, ogv
				 */

				var supportedVideoFormats = ['webm','ogg','ogv','mp4']

				 var extension = imageSource.split('.').pop()
				 var supportVideo = utilitiesService.supports_video()

				//checks if the browsers supports video and its a supported format the file
				//TODO:currently this is false
				if(false && supportVideo && utilitiesService.inArray(extension,supportedVideoFormats)){


					/*<div class="video-container" >
						<video controls=false preload >
							<source src="{{assetsPath}}/{{packageDetails.shop_image_v4}}" type=''/>
						</video>
						<div class="video-controls"></div>
					</div>*/

					var container = angular.element( '<div>' ).addClass( 'video-container');
					//Video element and controls
					var video = angular.element( '<video>' );
						video[0].setAttribute("preload","auto");
						video[0].setAttribute("controls","false");
						video[0].setAttribute("id","video");

					video.wrap(container)

					switch(extension){
						case 'webm':
							if(utilitiesService.supports_webm_video()){
								source[0].type = "video/webm"
							}
							break;
						case 'ogg':
						case 'ogv':
							if(utilitiesService.supports_ogg_theora_video()){
								source[0].type = "video/ogg"
							}
							break;
						case 'mp4':
							if(utilitiesService.supports_h264_baseline_video()){
								source[0].type = "video/mp4"

							}
							break;
						/*default:
							//if we have to do fallback to flash, used for desktop
							var source = null;
								source = angular.element( '<object >' );
								source[0].setAttribute("type","application/x-shockwave-flash");
								source[0].setAttribute("data","http://releases.flowplayer.org/swf/flowplayer-3.2.1.swf");
								source.css({ 'width': '100%' });

								image.wrap(source)

							break;*/
					}


					//add the video to source
					source.wrap(video)

					//creating some custom controls
					var controls = angular.element( '<div>' ).addClass( 'video-controls');
					var icon = angular.element( '<span>' ).addClass( 'icon-bulletarrow');

					icon.wrap(controls)

					//Event listener for the play/pause button
						controls.bind("click", function() {
							if (video[0].paused == true) {
								videoContainer.css({'display':'none'});

								// Play the video
								video[0].play();
							} else {
								// Pause the video
								video[0].pause();
							}
						});

						//detect when the video ended
						video.bind("ended", function() {
							videoContainer.css({'display':'block'});
						});


					//add the video to the video-container
					container.append(controls)
					container.prepend(video)


					//finally lets push what we just build to document
					element.append(container)

					/*
					 * Styling the video-control to obtain the poster
					 * TODO://need to load the image dinamically
					 */
					var videoContainer = utilitiesService.getObject('.video-controls')
					videoContainer.css({
						 'background-image': 'url(https://assets.accesso.com/demo/images/v5seasonpass.png)'
						,'background-size':'100% 100%'
						});

					setClassesOnload()

				}else{

					image.onload = function(){
						setClassesOnload()
						/**
						 * this is an additional style to verify-image-scr attribute,
						 * if it contails data-true it will set the within the css
						 * of the parent container
						 *
						 */
						if(attrs.$attr.true ? true : false){
							element.css({
									'background-image': 'url('+attrs.verifyImageSrc+')'
								});
						}else{
							//append the new image
							element.append(image)
						}

						return
					}

					image.onerror = function() {
						element.addClass('ng-invalid')
						//set the height of missing image ui feel
						element.find('img' ).css({'height':'187px'});
						//append the new image, if there is an image
						if(icon)
							element.append('<span class="'+icon+'"></span>')
					}
				}




				function setClassesOnload(){
					//hide any images within the children of the element, this is mainly for placeholders
					element.find('img' ).addClass('hide');

					//add success class to manipulate
					element.removeClass('ng-invalid')
					element.addClass('ng-valid')

				}
			}
		};
		return directive;
	}]);
