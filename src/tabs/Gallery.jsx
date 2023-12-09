import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';
import { MyModal } from 'components/MyModal/MyModal';

export class Gallery extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isLoading:false,
    error: null,
    isEmpty: false,
    isVisible:false,
    largeImg:'',
    tags: '',
    showModal:false,
  };

componentDidUpdate(prevProps, prevState){
  const {page, query} = this.state;
  if (prevState.query !== query || prevState.page !== page) {
    this.getPhotos(query, page);
  }
}


onOpenMOdal =(largeImg, tags)=>{
this.setState({showModal:true, largeImg , tags})
}

onCloseModal =()=>{
  this.setState({showModal:false, largeImg:'' , tags:''})
  }
  

getPhotos = async(query, page) => {
if (!query) return
this.setState({isLoading:true})

try {
  const {page:currentPage, photos, per_page,total_results} = await ImageService.getImages(query, page)
  if (photos.length === 0) {
    this.setState({isEmpty:true})
  }
  this.setState(prevState => ({images:[...prevState.images, ...photos], isVisible:currentPage < Math.ceil(total_results / per_page )}))
} catch (error) {
  this.setState({error: "something wrong("})
} finally{
  this.setState({isLoading:false})
}
}




  onHandleSubmit = searchQuery => {   
    this.setState({ query: searchQuery, page:1 , images:[], error:null, isEmpty:false});
  
  };


  onLoadMore = () => {
    this.setState(prevState => ({page: prevState.page + 1}))
  }


  render() {
    const {images, isVisible, isEmpty, error, isLoading} = this.state;
    return (
      <>
        <SearchForm onSubmit={this.onHandleSubmit} />
        {isEmpty && <Text textAlign="center">Sorry. There are no images ... 😭</Text>}
        {error && <Text textAlign="center">❌ Something went wrong - {error}</Text>}
        <Grid> 
          {images.length > 0 && images.map(({alt, id, src ,avg_color}) => (
           <GridItem key={id} onClick={()=> this.onOpenMOdal(src.large, alt)}>
           <CardItem color={avg_color}>
         <img src={src.large} alt={alt}/>
           </CardItem >
          
           </GridItem>
          ) )}
           </Grid>
           <MyModal 
           modalIsOpen={this.state.showModal}
           closeModal={this.onCloseModal}
           largeImg={this.state.largeImg}
           tags={this.state.tags}
        
           />

           
           {isVisible && !isLoading && images.length > 0 && <Button onClick={this.onLoadMore}> 
           
           {isLoading ? 'loading' : 'load more'}
           
            </Button>}
      </>
    );
  }
}
