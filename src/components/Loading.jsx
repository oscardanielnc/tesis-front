import "./scss/Loading.scss"

export default function Loading (props) {
    const {size=100, loading} = props;

    if(loading) return;

    return (
        <div class="cuf-loading">
            <div class="cuf-loading-content">
                <div class="f1078404_sup" style={{width: `${size}px`,height: `${size}px`,borderWidth: `${size*.05}px`}}>
                    <div class="f978404_petit">
                        <div class="f1078404_fond" style={{width: `${size}px`}}>
                            <div class="f1078404" style={{width: `${size*.8}px`,
                                height: `${size*.8}px`,borderWidth: `${size*.1}px`}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
