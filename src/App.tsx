import React, {useState} from 'react';
import axios from "axios";
import 'react-notifications-component/dist/theme.css'
import {ReactNotifications, Store} from 'react-notifications-component'

interface ColorModel{
    name: string,
    hex: string,
    luminance: number
}

const CardComponent = (props: ColorModel) => {
    const textColor = props.luminance<65?'white':'black';

    return (
        <>
            <div
                className="block p-6 w-60 h-30 rounded-lg border border-black shadow-black shadow-sm"
                style={{
                    background:props.hex,
                    color: textColor
                }}
                onClick={()=>{
                    navigator.clipboard.writeText(props.name+'\t'+ props.hex);
                    Store.removeAllNotifications();
                    Store.addNotification({
                        title: "Success!",
                        message: 'Copied '+props.name+' to clipboard',
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                }}
            >
                <div className={'font-bold text-center cursor-pointer'}>
                    {props.name}
                </div>
                <div className={'font-bold text-center cursor-pointer'}>
                    {props.hex}
                </div>
            </div>
        </>
    );
}

function App() {


    const [colors, setColors] = useState<ColorModel[]>([]);

    const onChangeSearch = (event: React.FormEvent<HTMLInputElement>) => {
        const searchValue = event.currentTarget.value;

        axios
            .get('https://api.color.pizza/v1/names/'+searchValue)
            .then((response)=>{
                setColors(
                    response.data.colors
                );
            })
        ;
    }

    return (
        <div className="App">
            <ReactNotifications/>
            <div className={'container mx-auto p-4 mt-4'}>
                <form className="flex items-center max-w-md mx-auto">
                    <label htmlFor="simple-search" className="sr-only">Search</label>
                    <div className="relative w-full">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                 fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                        <input type="text" id="simple-search"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="Search" onChange={onChangeSearch} required/>
                    </div>
                </form>

                <div className={'flex flex-wrap justify-center gap-4 mt-2 p-2'}>
                    {
                        colors.map((color) => {
                            return (
                                <>
                                    <CardComponent
                                        name={color.name}
                                        hex={color.hex}
                                        luminance={color.luminance}
                                    />
                                </>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
